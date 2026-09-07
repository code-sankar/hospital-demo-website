import crypto from 'node:crypto'
import Razorpay from 'razorpay'
import { config } from '../config.js'
import { badRequest } from '../lib/errors.js'
import { logger } from '../lib/logger.js'

/**
 * Payment providers behind one small interface, so swapping Razorpay for
 * another gateway is a new file rather than a change to the booking flow.
 *
 *   createOrder({ amountPaise, receipt, notes }) -> { orderId, checkout }
 *   verifyPayment(payload)                       -> { paymentId, signature, raw }
 *   verifyWebhook(rawBody, signature)            -> parsed event | throws
 */

const razorpayClient = () => {
  if (!config.payments.razorpay.keyId) {
    throw new Error('Razorpay is selected but RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are not set.')
  }
  return new Razorpay({
    key_id: config.payments.razorpay.keyId,
    key_secret: config.payments.razorpay.keySecret,
  })
}

const timingSafeEqual = (a, b) => {
  const ab = Buffer.from(a ?? '', 'utf8')
  const bb = Buffer.from(b ?? '', 'utf8')
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb)
}

const razorpayProvider = {
  name: 'razorpay',

  async createOrder({ amountPaise, receipt, notes }) {
    const order = await razorpayClient().orders.create({
      amount: amountPaise,
      currency: config.clinic.currency,
      receipt,
      notes,
      // Payment must succeed in one attempt against this order or a new one is
      // made; keeps the slot hold and the order lifetime aligned.
      payment_capture: 1,
    })
    return {
      orderId: order.id,
      checkout: {
        provider: 'razorpay',
        keyId: config.payments.razorpay.keyId,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
      },
    }
  },

  /** Verifies the handshake the Razorpay checkout widget hands back. */
  verifyPayment({ orderId, payload }) {
    const { razorpay_payment_id: paymentId, razorpay_signature: signature } = payload ?? {}
    if (!paymentId || !signature) throw badRequest('The payment response was incomplete.')

    const expected = crypto
      .createHmac('sha256', config.payments.razorpay.keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex')

    if (!timingSafeEqual(expected, signature)) {
      throw badRequest('We could not verify that payment. Nothing has been charged twice — contact us with your order id.')
    }
    return { paymentId, signature, raw: payload }
  },

  verifyWebhook(rawBody, signature) {
    const secret = config.payments.razorpay.webhookSecret
    if (!secret) throw badRequest('Webhooks are not configured.')
    const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
    if (!timingSafeEqual(expected, signature)) throw badRequest('Invalid webhook signature.')
    return JSON.parse(rawBody.toString('utf8'))
  },
}

/**
 * Stand-in gateway for local development, automated tests and demos. It creates
 * orders and verifies a deterministic signature so the entire booking flow —
 * including the failure paths — can be exercised without gateway credentials.
 * It never moves money and refuses to load in production.
 */
const mockProvider = {
  name: 'mock',

  async createOrder({ amountPaise, receipt }) {
    const orderId = `mock_order_${crypto.randomBytes(9).toString('hex')}`
    return {
      orderId,
      checkout: {
        provider: 'mock',
        orderId,
        amount: amountPaise,
        currency: config.clinic.currency,
        receipt,
        // The client posts this back to /verify to simulate a successful payment.
        mockSignature: mockSignatureFor(orderId, `mock_pay_${orderId.slice(-8)}`),
        mockPaymentId: `mock_pay_${orderId.slice(-8)}`,
      },
    }
  },

  verifyPayment({ orderId, payload }) {
    const paymentId = payload?.razorpay_payment_id ?? `mock_pay_${orderId.slice(-8)}`
    const signature = payload?.razorpay_signature
    if (!timingSafeEqual(mockSignatureFor(orderId, paymentId), signature)) {
      throw badRequest('Mock payment signature did not match.')
    }
    return { paymentId, signature, raw: payload ?? {} }
  },

  verifyWebhook(rawBody) {
    return JSON.parse(rawBody.toString('utf8'))
  },
}

const mockSignatureFor = (orderId, paymentId) =>
  crypto.createHmac('sha256', config.auth.jwtSecret).update(`${orderId}|${paymentId}`).digest('hex')

const providers = { razorpay: razorpayProvider, mock: mockProvider }

export function paymentProvider() {
  const name = config.payments.provider
  const provider = providers[name]
  if (!provider) throw new Error(`Unknown PAYMENT_PROVIDER "${name}". Use "razorpay" or "mock".`)
  if (name === 'mock' && config.isProd) {
    throw new Error('The mock payment provider must never run in production. Set PAYMENT_PROVIDER=razorpay.')
  }
  if (name === 'mock' && !config.isTest) {
    logger.warn('Payments are running on the MOCK provider — no money will be taken.')
  }
  return provider
}
