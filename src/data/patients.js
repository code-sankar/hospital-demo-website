export const visitPlanning = [
  {
    title: 'Before you arrive',
    items: [
      'Bring photo identification and your insurance card or policy number.',
      'Bring a list of current medicines, including doses and any supplements.',
      'Bring previous imaging on disc or a portal link — not just the report.',
      'Arrive fifteen minutes early for registration; thirty minutes for a procedure.',
      'Fasting instructions, where required, are sent by SMS the day before.',
    ],
  },
  {
    title: 'Finding us',
    items: [
      'Main entrance on Rue de la Charité; emergency entrance on the north side.',
      'Underground parking, 420 spaces, first ninety minutes free for patients.',
      'Tram lines 12 and 18 stop directly outside the main portico.',
      'Step-free access throughout; wheelchairs available at both entrances.',
      'Assistance-dog friendly across the entire campus.',
    ],
  },
  {
    title: 'During your stay',
    items: [
      'Private and semi-private rooms, all with an en-suite and daylight.',
      'A named nurse for every shift, introduced by name at handover.',
      'Meals prepared on site with dietitian-approved and cultural menus.',
      'Free Wi-Fi, and a companion bed available in most room categories.',
      'Interpreters in eleven languages, on site or by video within minutes.',
    ],
  },
]

export const visitingHours = [
  { ward: 'General wards', hours: '11:00 – 20:00', note: 'Two visitors at a time' },
  { ward: 'Intensive care', hours: '13:00 – 16:00 · 18:00 – 20:00', note: 'Immediate family, by arrangement' },
  { ward: 'Maternity & postnatal', hours: 'Partners: unrestricted · Others: 14:00 – 19:00', note: '' },
  { ward: 'Paediatrics', hours: 'Parents: unrestricted', note: 'Siblings 15:00 – 18:00' },
  { ward: 'Day surgery', hours: 'One companion throughout', note: 'Discharge escort required' },
]

export const insurers = [
  'Helsana',
  'CSS Versicherung',
  'Swica',
  'Allianz Care',
  'AXA Global Healthcare',
  'Cigna Global',
  'Bupa Global',
  'Generali',
  'Aetna International',
  'April International',
]

export const packages = [
  {
    name: 'Essentials Screening',
    price: 'CHF 190',
    duration: 'Half day',
    tone: 'light',
    description: 'A focused baseline for adults under forty with no known risk factors.',
    includes: [
      'Full blood count, renal, liver and thyroid profile',
      'Fasting glucose, HbA1c and lipid panel',
      'Blood pressure, BMI and waist assessment',
      'Resting ECG',
      'Physician consultation and written report',
    ],
  },
  {
    name: 'Comprehensive Health Review',
    price: 'CHF 690',
    duration: 'One day',
    tone: 'feature',
    description: 'Our most requested assessment — organ-system screening with imaging and specialist review.',
    includes: [
      'Everything in the Essentials Screening',
      'Chest X-ray and abdominal ultrasound',
      'Exercise stress test with cardiologist review',
      'Lung function testing and vision & hearing screen',
      'Dietetics consultation and personalised risk report',
      'Cancer marker panel appropriate to age and sex',
    ],
  },
  {
    name: 'Executive & Longevity',
    price: 'CHF 1,850',
    duration: 'Two days',
    tone: 'light',
    description: 'Advanced imaging and cardiometabolic profiling for a detailed picture of long-term risk.',
    includes: [
      'Everything in the Comprehensive Health Review',
      'Cardiac CT calcium score',
      'Whole-body MRI (non-contrast screening protocol)',
      'Carotid intima-media thickness and vascular age',
      'DEXA body composition and bone density',
      'Consultant follow-up at three and twelve months',
    ],
  },
]

export const internationalServices = [
  { title: 'Visa & documentation', detail: 'Invitation letters and medical visa support issued within 48 hours of a confirmed plan.' },
  { title: 'Written estimates', detail: 'A fixed-price treatment estimate before you travel, valid for ninety days.' },
  { title: 'Airport & transfers', detail: 'Meet-and-greet at Geneva Airport with medically equipped transfer where needed.' },
  { title: 'Interpreters', detail: 'Eleven languages on site; a further thirty available by video within minutes.' },
  { title: 'Accommodation', detail: 'Partner residences within walking distance for accompanying family.' },
  { title: 'Aftercare at home', detail: 'Discharge summaries in your language and tele-review with your consultant.' },
]

export const faqs = [
  {
    q: 'Do I need a referral to book an appointment?',
    a: 'For most outpatient clinics you can book directly with us. A referral letter from your family doctor is helpful — it gives the consultant your history — and some insurers require one for reimbursement. Our appointments team will tell you at the time of booking.',
  },
  {
    q: 'How quickly can I be seen?',
    a: 'Routine outpatient appointments are typically offered within five to ten working days. Urgent referrals — suspected cancer, chest pain, first seizure, acute deterioration — are seen within seventy-two hours, and the Emergency Department is open at all hours without an appointment.',
  },
  {
    q: 'Which insurers do you work with?',
    a: 'We hold direct-billing agreements with all major Swiss insurers and most international policies, including Allianz Care, Cigna Global, Bupa Global, AXA and Aetna. Where direct billing is not available, we provide itemised invoices formatted for reimbursement.',
  },
  {
    q: 'Can I get a written estimate before treatment?',
    a: 'Yes, and we encourage it. For any planned procedure we issue a fixed-price estimate covering surgeon, anaesthetist, theatre, implant and expected length of stay. The estimate is valid for ninety days and we notify you before any variation.',
  },
  {
    q: 'How do I access my records and results?',
    a: 'Through the patient portal, where reports and full-resolution images are released to you at the same moment they reach your consultant. You may download them or generate a secure share link for another clinician at no charge.',
  },
  {
    q: 'Do you offer video consultations?',
    a: 'Yes — for follow-up reviews, results discussions and second opinions. First appointments in most specialities are held in person so that an examination can be performed, but the appointments team will advise where video is appropriate.',
  },
  {
    q: 'What are the rules on visiting?',
    a: 'General wards welcome visitors between 11:00 and 20:00, two at a time. Parents of children and partners of maternity patients are never treated as visitors and may stay at any hour. Intensive care has protected rest periods; the nurse in charge will arrange access.',
  },
  {
    q: 'Is interpretation available?',
    a: 'Interpreters covering eleven languages are on site during clinic hours, with a further thirty available by video within minutes. Please tell us your preferred language when booking so the interpreter is scheduled in advance.',
  },
  {
    q: 'How do I make a complaint or give feedback?',
    a: 'Speak first to the nurse in charge, who can often resolve matters immediately. Formal concerns go to the Patient Liaison Office, which acknowledges within two working days and responds substantively within twenty. Compliments reach the named staff member and their team.',
  },
]

export const emergencySigns = [
  'Chest pain or tightness lasting more than a few minutes',
  'Face drooping, arm weakness or slurred speech',
  'Severe difficulty breathing or blue lips',
  'Heavy bleeding that will not stop with pressure',
  'A rash that does not fade under pressure',
  'Sudden confusion, collapse or a first seizure',
]
