/** Currency lives in paise as an integer everywhere; format only at the edges. */
export const formatINR = (paise) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: paise % 100 === 0 ? 0 : 2,
  }).format(paise / 100)

export const rupeesToPaise = (rupees) => Math.round(Number(rupees) * 100)
