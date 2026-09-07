import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { z } from 'zod'
import { config } from '../config.js'
import { asyncHandler, badRequest, notFound } from '../lib/errors.js'
import { validate } from '../middleware/validate.js'
import { holdSlot, confirmPayment, releaseHold } from '../services/appointments.js'
import { getTicketByReference, getTicketById } from '../services/tickets.js'

export const appointmentsRouter = Router()

const bookingLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: config.isTest ? 1000 : 12,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: { message: 'Too many booking attempts. Please wait a few minutes or call us.' } },
})

const holdSchema = z.object({
  doctorSlug: z.string().trim().min(1),
  startsAt: z.string().datetime({ offset: true }),
  reason: z.enum(['new', 'follow-up', 'second-opinion', 'package']).default('new'),
  notes: z.string().trim().max(1000).default(''),
  patient: z.object({
    fullName: z.string().trim().min(2, 'Enter the patient’s full name.').max(120),
    email: z.string().trim().toLowerCase().email('Enter a valid email address.'),
    // Deliberately permissive: Indian mobiles, landlines with STD codes and
    // international numbers all have to work here.
    phone: z
      .string()
      .trim()
      .min(8, 'Enter a contact number.')
      .max(20)
      .regex(/^[+()\-\s0-9]+$/, 'Use digits, spaces and + only.'),
    dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  }),
  // Written as a refine rather than z.literal(true) so the patient sees a
  // sentence they can act on instead of "expected true".
  termsAccepted: z
    .boolean()
    .refine((v) => v === true, 'Please accept the non-refundable payment terms to continue.'),
})

appointmentsRouter.post(
  '/hold',
  bookingLimiter,
  validate({ body: holdSchema }),
  asyncHandler(async (req, res) => {
    const held = await holdSlot(req.body)
    res.status(201).json({
      ...held,
      holdMinutes: config.clinic.holdMinutes,
      refundPolicy: 'non_refundable',
    })
  }),
)

appointmentsRouter.post(
  '/:id/release',
  validate({ params: z.object({ id: z.string().uuid() }) }),
  asyncHandler(async (req, res) => {
    const released = await releaseHold(req.params.id)
    res.json({ released })
  }),
)

appointmentsRouter.post(
  '/:id/confirm',
  bookingLimiter,
  validate({
    params: z.object({ id: z.string().uuid() }),
    body: z.object({
      razorpay_payment_id: z.string().optional(),
      razorpay_order_id: z.string().optional(),
      razorpay_signature: z.string().optional(),
    }),
  }),
  asyncHandler(async (req, res) => {
    const { ticket, delivery, alreadyConfirmed } = await confirmPayment({
      appointmentId: req.params.id,
      payload: req.body,
    })
    res.json({ ticket, delivery, alreadyConfirmed })
  }),
)

/** Lets the checkout page poll its own booking while the hold is running. */
appointmentsRouter.get(
  '/:id',
  validate({ params: z.object({ id: z.string().uuid() }) }),
  asyncHandler(async (req, res) => {
    const ticket = await getTicketById(req.params.id)
    if (!ticket) throw notFound('We could not find that booking.')
    res.json({ ticket: ticket.status === 'confirmed' ? ticket : { ...ticket, reference: null } })
  }),
)

export const ticketsRouter = Router()

const lookupLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: config.isTest ? 1000 : 40,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: { message: 'Too many lookups. Please wait a few minutes.' } },
})

/**
 * Public ticket view. The code is the credential, so it is rate limited and
 * only ever discloses a confirmed booking.
 */
ticketsRouter.get(
  '/:reference',
  lookupLimiter,
  validate({ params: z.object({ reference: z.string().trim().min(6).max(20) }) }),
  asyncHandler(async (req, res) => {
    const ticket = await getTicketByReference(req.params.reference)
    if (!ticket || ticket.status !== 'confirmed') throw notFound('No ticket matches that code.')

    res.json({
      ticket: {
        reference: ticket.reference,
        startsAt: ticket.startsAt,
        endsAt: ticket.endsAt,
        status: ticket.status,
        checkedInAt: ticket.checkedInAt,
        amountPaise: ticket.amountPaise,
        refundPolicy: ticket.refundPolicy,
        doctor: ticket.doctor,
        // Enough for the patient to recognise their own ticket, not enough to
        // be a useful leak if a code is guessed.
        patient: { fullName: ticket.patient.fullName },
      },
    })
  }),
)

/** Kept out of the public router: only the counter console may use it. */
export const requireTicket = asyncHandler(async (req, _res, next) => {
  const ticket = await getTicketByReference(req.params.reference)
  if (!ticket) throw notFound('No booking matches that code.')
  if (ticket.status === 'pending_payment') throw badRequest('That booking has not been paid for yet.')
  req.ticket = ticket
  next()
})
