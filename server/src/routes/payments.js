import { Router } from 'express'
import express from 'express'
import { query } from '../db/pool.js'
import { asyncHandler } from '../lib/errors.js'
import { logger } from '../lib/logger.js'
import { paymentProvider } from '../services/payments.js'
import { confirmPayment } from '../services/appointments.js'

export const paymentsRouter = Router()

/**
 * Gateway webhook. This is the safety net: if the patient closes the tab
 * between paying and being redirected back, the appointment is still confirmed
 * and the ticket still issued.
 *
 * Needs the raw body — the signature is over the exact bytes sent.
 */
paymentsRouter.post(
  '/webhook',
  express.raw({ type: '*/*', limit: '1mb' }),
  asyncHandler(async (req, res) => {
    const provider = paymentProvider()
    const signature = req.get('x-razorpay-signature') ?? ''

    let event
    try {
      event = provider.verifyWebhook(req.body, signature)
    } catch (err) {
      logger.warn({ err }, 'rejected webhook with a bad signature')
      return res.status(400).json({ error: { message: 'Invalid signature.' } })
    }

    const entity = event?.payload?.payment?.entity
    const orderId = entity?.order_id
    if (!orderId) return res.json({ ok: true, ignored: true })

    const { rows } = await query(
      `SELECT appointment_id FROM payments WHERE provider = $1 AND provider_order_id = $2`,
      [provider.name, orderId],
    )
    if (!rows[0]) return res.json({ ok: true, ignored: true })

    if (event.event === 'payment.captured' || event.event === 'order.paid') {
      try {
        // confirmPayment is idempotent, so a webhook racing the browser
        // redirect settles harmlessly.
        await confirmPayment({
          appointmentId: rows[0].appointment_id,
          trusted: true,
          payload: { razorpay_payment_id: entity.id, razorpay_order_id: orderId, viaWebhook: true },
        })
      } catch (err) {
        logger.error({ err, orderId }, 'webhook confirmation failed')
      }
    } else if (event.event === 'payment.failed') {
      await query(
        `UPDATE payments SET status = 'failed', failure_reason = $2, raw = $3
          WHERE provider = $4 AND provider_order_id = $1`,
        [orderId, entity.error_description ?? 'payment failed', JSON.stringify(entity), provider.name],
      )
    }

    res.json({ ok: true })
  }),
)
