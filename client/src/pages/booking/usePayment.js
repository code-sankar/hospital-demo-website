import { useCallback, useState } from 'react'
import { api } from '../../api/client'

/** Loads the Razorpay checkout script once, on demand. */
function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve(window.Razorpay)
  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-razorpay]')
    if (existing) {
      existing.addEventListener('load', () => resolve(window.Razorpay))
      existing.addEventListener('error', () => reject(new Error('Could not load the payment gateway.')))
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.dataset.razorpay = 'true'
    script.onload = () => resolve(window.Razorpay)
    script.onerror = () => reject(new Error('Could not load the payment gateway.'))
    document.head.appendChild(script)
  })
}

/**
 * Drives whichever gateway the server chose. The server decides and the browser
 * is told, which keeps the two from ever disagreeing about how a booking was paid.
 */
export function usePayment({ onConfirmed }) {
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState(null)

  const confirm = useCallback(
    async (appointmentId, payload) => {
      const res = await api.confirm(appointmentId, payload)
      onConfirmed(res)
      return res
    },
    [onConfirmed],
  )

  const pay = useCallback(
    async (hold, patient) => {
      setError(null)
      setPaying(true)
      try {
        const { checkout } = hold

        if (checkout.provider === 'mock') {
          // The stand-in gateway settles immediately. The payload shape is
          // identical to the real one, so this path exercises the same code.
          await confirm(hold.appointmentId, {
            razorpay_order_id: checkout.orderId,
            razorpay_payment_id: checkout.mockPaymentId,
            razorpay_signature: checkout.mockSignature,
          })
          return
        }

        const Razorpay = await loadRazorpay()
        await new Promise((resolve, reject) => {
          const rzp = new Razorpay({
            key: checkout.keyId,
            order_id: checkout.orderId,
            amount: checkout.amount,
            currency: checkout.currency,
            name: 'Ashvini Institute of Medical Sciences',
            description: 'Consultation fee — payable in advance, non-refundable',
            prefill: { name: patient.fullName, email: patient.email, contact: patient.phone },
            theme: { color: '#0e3b38' },
            handler: (response) => confirm(hold.appointmentId, response).then(resolve).catch(reject),
            modal: {
              ondismiss: () =>
                reject(new Error('Payment was cancelled. Your slot is held for a few more minutes.')),
            },
          })
          rzp.on('payment.failed', (e) =>
            reject(new Error(e?.error?.description ?? 'The payment did not go through.')),
          )
          rzp.open()
        })
      } catch (err) {
        setError(err.message ?? 'The payment could not be completed.')
        throw err
      } finally {
        setPaying(false)
      }
    },
    [confirm],
  )

  return { pay, paying, error, setError }
}
