export const visitPlanning = [
  {
    title: 'Before you arrive',
    items: [
      'Bring photo identification — Aadhaar, PAN, passport or driving licence.',
      'Bring your health insurance card and TPA number, or your CGHS / ESIC card.',
      'Bring all current medicines in their strips, plus any Ayurvedic or herbal supplements.',
      'Bring previous scans on CD or a portal link — not just the report.',
      'Arrive fifteen minutes early for registration; forty-five minutes for a procedure.',
    ],
  },
  {
    title: 'Finding us',
    items: [
      'Main entrance on Palace Cross Road; emergency entrance on the Cunningham Road side.',
      'Cubbon Park metro station is a seven-minute drive; feeder autos wait at the gate.',
      'Basement parking for 340 cars and 200 two-wheelers; first two hours free for patients.',
      'Step-free access throughout, with wheelchairs and porters at both entrances.',
      'Drop-off bay under the portico for elderly patients before you park.',
    ],
  },
  {
    title: 'During your stay',
    items: [
      'Single, twin-sharing and suite rooms, each with an attendant bed and daylight.',
      'A named nurse for every shift, introduced to you by name at handover.',
      'Pure-vegetarian, Jain, diabetic and renal diets prepared in a separate kitchen.',
      'Free Wi-Fi, and one attendant pass issued per patient at admission.',
      'Interpreters in nine languages, on the ward or by video within minutes.',
    ],
  },
]

export const visitingHours = [
  { ward: 'General wards', hours: '11:00 am – 1:00 pm · 5:00 pm – 8:00 pm', note: 'Two visitors at a time' },
  { ward: 'Intensive care', hours: '12:00 pm – 1:00 pm · 6:00 pm – 7:00 pm', note: 'One family member, by arrangement' },
  { ward: 'Maternity & postnatal', hours: 'Husband or attendant: unrestricted · Others: 4:00 pm – 7:00 pm', note: '' },
  { ward: 'Paediatrics', hours: 'Parents: unrestricted', note: 'Siblings 4:00 pm – 6:00 pm' },
  { ward: 'Day-care & surgery', hours: 'One attendant throughout', note: 'Discharge escort required' },
]

export const insurers = [
  'Star Health',
  'HDFC ERGO',
  'ICICI Lombard',
  'Niva Bupa',
  'Care Health',
  'Aditya Birla Health',
  'Bajaj Allianz',
  'TATA AIG',
  'New India Assurance',
  'Oriental Insurance',
  'Medi Assist (TPA)',
  'Paramount (TPA)',
  'CGHS',
  'ESIC',
  'Ayushman Bharat PM-JAY',
]

export const packages = [
  {
    name: 'Essentials Health Check',
    price: '₹2,400',
    duration: 'Half day',
    tone: 'light',
    description: 'A focused baseline for adults under forty with no known risk factors.',
    includes: [
      'Complete blood count, kidney, liver and thyroid profile',
      'Fasting glucose, HbA1c and lipid panel',
      'Blood pressure, BMI and waist measurement',
      'Resting ECG and chest X-ray',
      'Physician consultation and a written report',
    ],
  },
  {
    name: 'Comprehensive Health Review',
    price: '₹7,900',
    duration: 'One day',
    tone: 'feature',
    description: 'Our most requested assessment — organ-system screening with imaging and specialist review.',
    includes: [
      'Everything in the Essentials Health Check',
      'Ultrasound abdomen and pelvis',
      'Treadmill test with cardiologist review',
      'Lung function testing, vision and hearing screen',
      'Vitamin D, vitamin B12 and iron studies',
      'Dietetics consultation and a personalised risk report',
    ],
  },
  {
    name: 'Executive & Longevity',
    price: '₹24,500',
    duration: 'Two days',
    tone: 'light',
    description: 'Advanced imaging and cardiometabolic profiling for a detailed picture of long-term risk.',
    includes: [
      'Everything in the Comprehensive Health Review',
      'Cardiac CT calcium score',
      'Whole-body MRI (non-contrast screening protocol)',
      'Carotid intima-media thickness and vascular age',
      'FibroScan for liver fat and fibrosis',
      'Consultant follow-up at three and twelve months',
    ],
  },
]

export const internationalServices = [
  { title: 'Medical visa support', detail: 'Invitation letters for the Indian medical visa issued within 48 hours of a confirmed plan, plus help with FRRO registration.' },
  { title: 'Written estimates', detail: 'A fixed-price treatment estimate in INR or USD before you travel, valid for ninety days.' },
  { title: 'Airport & transfers', detail: 'Meet-and-greet at Kempegowda International Airport, with an ambulance transfer where the condition requires it.' },
  { title: 'Interpreters', detail: 'Arabic, French, Bengali, Amharic, Swahili and Russian interpreters arranged in advance of your arrival.' },
  { title: 'Accommodation', detail: 'Partner serviced apartments and guest houses within two kilometres for accompanying family.' },
  { title: 'Aftercare at home', detail: 'Discharge summaries in your language and video review with your consultant after you return.' },
]

export const faqs = [
  {
    q: 'Do I need a referral to book an appointment?',
    a: 'For most outpatient clinics you can book directly with us. A referral letter from your family doctor is helpful because it gives the consultant your history, and some insurers ask for one during pre-authorisation. Our appointments team will tell you at the time of booking.',
  },
  {
    q: 'How quickly can I be seen?',
    a: 'Routine outpatient appointments are usually offered within two to five working days. Urgent referrals — suspected cancer, chest pain, a first seizure, acute deterioration — are seen within 48 hours, and the Emergency Department is open around the clock without an appointment.',
  },
  {
    q: 'Is treatment cashless with my insurance?',
    a: 'We are empanelled with all major Indian insurers and third-party administrators, as well as CGHS, ESIC and Ayushman Bharat PM-JAY. Planned admissions need pre-authorisation, which our insurance desk files on your behalf — usually approved within four hours during working days.',
  },
  {
    q: 'Can I get a written estimate before treatment?',
    a: 'Yes, and we encourage it. For any planned procedure we issue a package estimate covering surgeon, anaesthetist, theatre, implant, room category and expected length of stay. The estimate is valid for ninety days and we tell you before anything varies from it.',
  },
  {
    q: 'How do I access my records and reports?',
    a: 'Through the patient portal, where reports and full-resolution images are released to you at the same moment they reach your consultant. You may download them or share a secure link with any other doctor at no charge.',
  },
  {
    q: 'Do you offer video consultations?',
    a: 'Yes — for follow-up reviews, reports discussions and second opinions, which is often easier for families travelling from outside Bengaluru. First appointments in most specialities are held in person so that an examination can be performed.',
  },
  {
    q: 'How many attendants can stay with a patient?',
    a: 'One attendant pass is issued at admission and that person may stay overnight; every room has an attendant bed. Parents of children and one companion for maternity patients are never counted as visitors and may stay at any hour.',
  },
  {
    q: 'Which languages do you support?',
    a: 'Our staff work in English, Kannada, Hindi, Tamil, Telugu, Malayalam, Marathi, Bengali and Urdu, with interpreters for other languages arranged on request. Tell us your preferred language when booking so it is scheduled in advance.',
  },
  {
    q: 'How do I raise a complaint or give feedback?',
    a: 'Speak first to the nurse in charge, who can often resolve matters immediately. Formal concerns go to the Patient Relations Office, which acknowledges within two working days and responds substantively within twenty. Compliments are passed to the named staff member and their team.',
  },
]

export const emergencySigns = [
  'Chest pain or tightness lasting more than a few minutes',
  'Face drooping, arm weakness or slurred speech',
  'Severe difficulty breathing, or blue lips',
  'Heavy bleeding that will not stop with pressure',
  'High fever with bleeding gums, black stools or severe abdominal pain',
  'Sudden confusion, collapse, a first seizure — or any snakebite',
]
