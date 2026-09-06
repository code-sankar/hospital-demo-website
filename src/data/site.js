/**
 * Single source of truth for the clinic's identity.
 * Rebranding the whole demo for a prospect is a matter of editing this file.
 */
export const site = {
  name: 'Vitalis',
  fullName: 'Vitalis Medical Centre',
  legalName: 'Vitalis Medical Centre & Institute of Clinical Sciences',
  tagline: 'Precision medicine, practised with care',
  established: 1924,
  claim: 'A European centre of excellence',
  description:
    'Vitalis Medical Centre brings together thirteen specialist institutes, a 24/7 emergency department and an academic research faculty under one roof — delivering evidence-led care with the warmth of a family practice.',

  phone: '+44 20 7946 0812',
  emergencyPhone: '112',
  ambulancePhone: '+44 20 7946 0999',
  email: 'welcome@vitalis-health.example',
  appointmentsEmail: 'appointments@vitalis-health.example',
  internationalEmail: 'international@vitalis-health.example',

  address: {
    line1: '18–24 Rue de la Charité',
    line2: 'Quartier Saint-Marc',
    city: 'Geneva',
    postcode: 'CH-1204',
    country: 'Switzerland',
  },

  hours: [
    { label: 'Outpatient clinics', value: 'Mon – Fri · 07:30 – 20:00' },
    { label: 'Saturday clinics', value: 'Sat · 08:00 – 14:00' },
    { label: 'Diagnostics & imaging', value: 'Mon – Sat · 07:00 – 21:00' },
    { label: 'Emergency department', value: 'Open 24 hours · 365 days' },
  ],

  social: [
    { label: 'LinkedIn', href: '#', icon: 'linkedin' },
    { label: 'Instagram', href: '#', icon: 'instagram' },
    { label: 'Facebook', href: '#', icon: 'facebook' },
    { label: 'YouTube', href: '#', icon: 'youtube' },
  ],

  languages: ['English', 'Français', 'Deutsch', 'Italiano', 'العربية', 'हिन्दी'],
}

/** Primary navigation. `children` renders the mega-menu column. */
export const navigation = [
  {
    label: 'Centres of Excellence',
    href: '/centres',
    children: [
      { label: 'All specialities', href: '/centres', description: 'Thirteen institutes, one standard of care' },
      { label: 'Cardiac Sciences', href: '/centres/cardiac-sciences', description: 'Hybrid theatres & structural heart' },
      { label: 'Neurosciences', href: '/centres/neurosciences', description: 'Stroke unit, epilepsy & neurosurgery' },
      { label: 'Oncology', href: '/centres/oncology', description: 'Tumour board & precision therapy' },
      { label: 'Orthopaedics', href: '/centres/orthopaedics', description: 'Robotic joint replacement & sports' },
      { label: 'Women & Newborn', href: '/centres/women-newborn', description: 'Midwife-led birthing suites' },
    ],
  },
  {
    label: 'Find a Doctor',
    href: '/doctors',
  },
  {
    label: 'Patients & Visitors',
    href: '/patients',
    children: [
      { label: 'Planning your visit', href: '/patients#planning', description: 'What to bring, where to arrive' },
      { label: 'Admissions & billing', href: '/patients#admissions', description: 'Insurance, estimates, cashless' },
      { label: 'International patients', href: '/patients#international', description: 'Visas, interpreters, transfers' },
      { label: 'Health packages', href: '/patients#packages', description: 'Preventive screening from CHF 190' },
      { label: 'Frequently asked', href: '/patients#faq', description: 'Answers to common questions' },
    ],
  },
  { label: 'Health Insights', href: '/insights' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

/** Small factual proof points used across the home page and footer. */
export const stats = [
  { value: 100, suffix: '+', label: 'Years of continuous care', sub: 'Founded in 1924' },
  { value: 13, suffix: '', label: 'Centres of excellence', sub: 'Single-campus, multi-disciplinary' },
  { value: 268, suffix: '', label: 'Consultants & registrars', sub: 'Board-certified across 9 countries' },
  { value: 41, suffix: 'k', label: 'Patients cared for each year', sub: 'Inpatient, day-case and outpatient' },
]

export const accreditations = [
  { name: 'Joint Commission International', short: 'JCI', note: 'Accredited academic medical centre' },
  { name: 'ISO 9001:2015', short: 'ISO', note: 'Quality management systems' },
  { name: 'European Society of Cardiology', short: 'ESC', note: 'Certified chest-pain centre' },
  { name: 'OECI Comprehensive Cancer Centre', short: 'OECI', note: 'Organisation of European Cancer Institutes' },
  { name: 'Baby-Friendly Hospital Initiative', short: 'BFHI', note: 'WHO / UNICEF designation' },
  { name: 'Swiss Leading Hospitals', short: 'SLH', note: 'Hospitality & patient-experience standard' },
]
