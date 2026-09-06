/**
 * Single source of truth for the hospital's identity.
 * Rebranding the whole demo for a prospect is a matter of editing this file.
 */
export const site = {
  name: 'Ashvini',
  fullName: 'Ashvini Institute of Medical Sciences',
  legalName: 'Ashvini Institute of Medical Sciences Pvt. Ltd.',
  tagline: 'Precision medicine, practised with care',
  established: 1926,
  claim: 'A century of clinical excellence',
  description:
    'Ashvini brings together thirteen specialist institutes, a 24×7 emergency department and an academic faculty on a single Bengaluru campus — delivering evidence-led care with the warmth of a family practice.',

  phone: '+91 80 4512 8800',
  emergencyPhone: '108',
  ambulancePhone: '+91 80 4512 8108',
  email: 'welcome@ashvini-health.example',
  appointmentsEmail: 'appointments@ashvini-health.example',
  internationalEmail: 'international@ashvini-health.example',

  address: {
    line1: '27 Palace Cross Road',
    line2: 'Vasanth Nagar',
    city: 'Bengaluru',
    postcode: '560 052',
    country: 'Karnataka, India',
  },

  hours: [
    { label: 'Outpatient clinics', value: 'Mon – Sat · 8:00 am – 8:00 pm' },
    { label: 'Sunday clinics', value: 'Sun · 9:00 am – 1:00 pm' },
    { label: 'Diagnostics & imaging', value: 'Mon – Sun · 7:00 am – 10:00 pm' },
    { label: 'Emergency department', value: 'Open 24×7 · 365 days' },
  ],

  social: [
    { label: 'LinkedIn', href: '#', icon: 'linkedin' },
    { label: 'Instagram', href: '#', icon: 'instagram' },
    { label: 'Facebook', href: '#', icon: 'facebook' },
    { label: 'YouTube', href: '#', icon: 'youtube' },
  ],

  languages: ['English', 'हिन्दी', 'ಕನ್ನಡ', 'தமிழ்', 'తెలుగు', 'മലയാളം', 'मराठी', 'বাংলা', 'العربية'],
}

/** Primary navigation. `children` renders the mega-menu column. */
export const navigation = [
  {
    label: 'Centres of Excellence',
    href: '/centres',
    children: [
      { label: 'All specialities', href: '/centres', description: 'Thirteen institutes, one standard of care' },
      { label: 'Cardiac Sciences', href: '/centres/cardiac-sciences', description: 'Cath labs & structural heart' },
      { label: 'Neurosciences', href: '/centres/neurosciences', description: 'Stroke unit, epilepsy & neurosurgery' },
      { label: 'Oncology', href: '/centres/oncology', description: 'Tumour board & precision therapy' },
      { label: 'Orthopaedics', href: '/centres/orthopaedics', description: 'Robotic joint replacement & trauma' },
      { label: 'Women & Newborn', href: '/centres/women-newborn', description: 'Obstetrics & level-3 NICU' },
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
      { label: 'Admissions & billing', href: '/patients#admissions', description: 'Cashless, TPAs, estimates' },
      { label: 'International patients', href: '/patients#international', description: 'Medical visa, interpreters, transfers' },
      { label: 'Health check packages', href: '/patients#packages', description: 'Preventive screening from ₹2,400' },
      { label: 'Frequently asked', href: '/patients#faq', description: 'Answers to common questions' },
    ],
  },
  { label: 'Health Insights', href: '/insights' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

/** Small factual proof points used across the home page and footer. */
export const stats = [
  { value: 100, suffix: '+', label: 'Years of continuous care', sub: 'Founded in 1926' },
  { value: 13, suffix: '', label: 'Centres of excellence', sub: 'Single-campus, multi-disciplinary' },
  { value: 312, suffix: '', label: 'Consultants & registrars', sub: 'Board-certified, DM / MCh / DNB' },
  { value: 386000, suffix: '', label: 'Patients cared for each year', sub: 'Inpatient, day-care and outpatient' },
]

export const accreditations = [
  { name: 'National Accreditation Board for Hospitals', short: 'NABH', note: 'Full accreditation, entry to advanced' },
  { name: 'National Accreditation Board for Laboratories', short: 'NABL', note: 'ISO 15189 medical laboratory' },
  { name: 'Joint Commission International', short: 'JCI', note: 'Accredited academic medical centre' },
  { name: 'ISO 9001:2015', short: 'ISO', note: 'Quality management systems' },
  { name: 'Baby-Friendly Hospital Initiative', short: 'BFHI', note: 'WHO / UNICEF designation' },
  { name: 'Association of Healthcare Providers India', short: 'AHPI', note: 'Patient-safety excellence award' },
]
