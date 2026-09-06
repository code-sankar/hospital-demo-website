export const articles = [
  {
    slug: 'reading-your-blood-pressure',
    title: 'What your blood pressure reading is actually telling you',
    excerpt:
      'Two numbers, a great deal of anxiety, and a surprising amount of nuance. A cardiologist explains what the figures mean and when they matter.',
    category: 'Heart Health',
    readingTime: 6,
    date: '2026-08-24',
    author: 'Dr Élise Moreau',
    authorSlug: 'elise-moreau',
    art: 'cardio',
    featured: true,
    body: [
      {
        type: 'p',
        text: 'A blood pressure reading is a snapshot of the force your blood exerts against the artery wall — once when the heart contracts, and once while it refills. The first number, systolic, is the peak. The second, diastolic, is the resting floor. Both matter, but they matter differently at different ages.',
      },
      { type: 'h', text: 'The figures worth remembering' },
      {
        type: 'p',
        text: 'For most adults, a reading consistently below 120/80 mmHg is considered optimal. Between 120/80 and 139/89 sits a grey zone often described as elevated, where lifestyle change alone frequently returns the numbers to normal. Sustained readings of 140/90 or above, confirmed on more than one occasion, meet the threshold for hypertension.',
      },
      {
        type: 'quote',
        text: 'A single high reading in a clinic corridor is not a diagnosis. It is an invitation to measure properly.',
      },
      { type: 'h', text: 'Why one reading is never enough' },
      {
        type: 'p',
        text: 'Blood pressure varies through the day by as much as 30 mmHg. It rises with caffeine, with a full bladder, with a rushed walk from the car park, and — famously — with the sight of a clinician. White-coat hypertension affects roughly one in five people, which is why we increasingly rely on 24-hour ambulatory monitoring or a week of home readings before starting treatment.',
      },
      { type: 'h', text: 'Measuring at home, properly' },
      {
        type: 'list',
        items: [
          'Sit quietly for five minutes first, back supported, feet flat on the floor.',
          'Rest your arm on a table so the cuff sits level with your heart.',
          'Take two readings a minute apart, morning and evening, for seven days.',
          'Discard the first day entirely — it is almost always the highest.',
          'Bring the whole log to your appointment rather than the worst number.',
        ],
      },
      {
        type: 'p',
        text: 'If your averaged home readings sit above 135/85, book a review. Treatment is rarely urgent, but it is rarely optional either — and the earlier it starts, the gentler it usually needs to be.',
      },
    ],
  },
  {
    slug: 'stroke-first-hour',
    title: 'The first hour after a stroke decides the next ten years',
    excerpt:
      'Roughly 1.9 million neurons are lost every minute an artery stays blocked. Here is what happens in our stroke unit, minute by minute.',
    category: 'Neurosciences',
    readingTime: 7,
    date: '2026-08-11',
    author: 'Dr Nadia Ben Ali',
    authorSlug: 'nadia-benali',
    art: 'neuro',
    featured: true,
    body: [
      {
        type: 'p',
        text: 'Stroke is the one emergency where the treatment window is measured not in hours but in minutes of surviving tissue. When a large artery in the brain occludes, the core of the territory dies quickly; a surrounding rim — the penumbra — survives on collateral flow and can still be rescued. Everything we do is designed to reach that rim before it is lost.',
      },
      { type: 'h', text: 'Minute 0 — recognition' },
      {
        type: 'p',
        text: 'FAST remains the most useful public test: Face drooping, Arm weakness, Speech difficulty, Time to call. Sudden visual loss, sudden severe unsteadiness and the abrupt worst-ever headache belong on the same list. The instruction is always the same — call the emergency number, do not drive, do not wait to see whether it settles.',
      },
      { type: 'h', text: 'Minute 12 — the pre-alert' },
      {
        type: 'p',
        text: 'The ambulance crew transmits a pre-alert from the roadside. By the time the trolley crosses our threshold, the stroke physician, the radiographer and the interventional team are already standing in the resuscitation bay, and the CT scanner has been cleared.',
      },
      { type: 'quote', text: 'The patient does not wait for the team. The team waits for the patient.' },
      { type: 'h', text: 'Minute 20 — imaging' },
      {
        type: 'p',
        text: 'CT and CT-angiography are performed on the emergency trolley without moving the patient to another department. Within a few minutes we know whether this is a bleed or a clot, and if it is a clot, exactly which vessel is occluded.',
      },
      { type: 'h', text: 'Minute 26 — thrombolysis' },
      {
        type: 'p',
        text: 'Our median door-to-needle time is 26 minutes. Clot-busting medication is given in the scanner room itself rather than after transfer to a ward — a small change of geography that removed nine minutes from the pathway.',
      },
      { type: 'h', text: 'Minute 55 — thrombectomy' },
      {
        type: 'p',
        text: 'For large-vessel occlusion, a catheter is passed from the groin or wrist to the brain and the clot physically retrieved. Available 24 hours a day, this procedure can convert a life-changing disability into a full recovery — but only if the patient reaches us in time.',
      },
      {
        type: 'p',
        text: 'Rehabilitation then begins on day one, not on discharge. The therapy team assesses swallowing, mobility and speech within four hours of admission, because the brain’s window for reorganisation opens immediately and narrows over months.',
      },
    ],
  },
  {
    slug: 'preparing-for-surgery',
    title: 'Prehabilitation: why the four weeks before surgery matter most',
    excerpt:
      'Patients who arrive at theatre stronger, better nourished and better rested recover faster. The evidence is unambiguous — and the programme is simple.',
    category: 'Surgery',
    readingTime: 5,
    date: '2026-07-29',
    author: 'Dr Matthias Reinhardt',
    authorSlug: 'matthias-reinhardt',
    art: 'ortho',
    featured: false,
    body: [
      {
        type: 'p',
        text: 'Surgery is a physiological insult. How well you tolerate it depends less on the operation than on the reserve you bring to it — muscle mass, aerobic capacity, protein status, haemoglobin and sleep. Prehabilitation is the deliberate improvement of those reserves in the weeks before a planned procedure.',
      },
      { type: 'h', text: 'What the programme involves' },
      {
        type: 'list',
        items: [
          'Twice-weekly supervised strength work for the muscles around the operative joint.',
          'Twenty minutes of brisk walking or cycling on most days.',
          'A protein target of roughly 1.2 g per kilogram of body weight daily.',
          'Iron and vitamin D correction where blood tests show a deficit.',
          'Complete smoking cessation — ideally six weeks before, but any period helps.',
        ],
      },
      { type: 'quote', text: 'The strongest predictor of walking on the day of surgery is how well you were walking a month before it.' },
      { type: 'h', text: 'What it achieves' },
      {
        type: 'p',
        text: 'In our arthroplasty cohort, patients completing four weeks of prehabilitation left hospital an average of 0.8 nights earlier, needed less opioid analgesia and reached their six-week function targets a fortnight sooner. Complication rates were lower, particularly chest infections and wound problems.',
      },
      {
        type: 'p',
        text: 'None of this requires a gymnasium. Most of the programme can be done at home with a resistance band and a chair, and our physiotherapy team will design it with you at the pre-assessment appointment.',
      },
    ],
  },
  {
    slug: 'childhood-fever-guide',
    title: 'A parent’s guide to childhood fever — and when to worry',
    excerpt:
      'Fever is a defence, not a disease. A paediatrician explains which signs genuinely warrant a hospital visit and which do not.',
    category: 'Children',
    readingTime: 6,
    date: '2026-07-15',
    author: 'Dr Tomáš Novák',
    authorSlug: 'tomas-novak',
    art: 'paeds',
    featured: false,
    body: [
      {
        type: 'p',
        text: 'A raised temperature is the immune system doing its job. The number on the thermometer correlates poorly with how serious an illness is — a child with a temperature of 39.5°C who is drinking, playing and interacting is usually far less concerning than a child at 38.2°C who is limp and refusing fluids.',
      },
      { type: 'h', text: 'Signs that need urgent assessment' },
      {
        type: 'list',
        items: [
          'A rash that does not fade when pressed with a glass.',
          'Breathing that is fast, laboured, or drawing in beneath the ribs.',
          'Unusual drowsiness, or difficulty waking the child.',
          'Any fever in an infant under three months of age.',
          'A stiff neck, severe headache or discomfort in bright light.',
          'Fewer than four wet nappies in twenty-four hours.',
        ],
      },
      { type: 'quote', text: 'Watch the child, not the thermometer.' },
      { type: 'h', text: 'What to do at home' },
      {
        type: 'p',
        text: 'Keep fluids going in small, frequent amounts. Dress the child lightly rather than wrapping them. Paracetamol or ibuprofen may be used for discomfort — not to chase the number down — and they should never be given together routinely without advice.',
      },
      {
        type: 'p',
        text: 'Most childhood fevers are viral and settle within three to five days. If a fever persists beyond five days, or the child improves and then deteriorates again, that pattern deserves a review.',
      },
    ],
  },
  {
    slug: 'cancer-second-opinion',
    title: 'Asking for a second opinion is not disloyalty — it is good medicine',
    excerpt:
      'A medical oncologist on why she encourages patients to seek another view, and how to do it without losing time.',
    category: 'Oncology',
    readingTime: 5,
    date: '2026-06-30',
    author: 'Dr Priya Raghunathan',
    authorSlug: 'priya-raghunathan',
    art: 'onco',
    featured: false,
    body: [
      {
        type: 'p',
        text: 'Patients often apologise before asking. They should not. Cancer treatment involves genuine judgement calls — the sequence of therapy, the extent of surgery, whether a trial is appropriate — and reasonable specialists sometimes reach different conclusions from the same scan.',
      },
      { type: 'h', text: 'When a second opinion adds most' },
      {
        type: 'list',
        items: [
          'Rare tumours, where volume of experience genuinely changes outcomes.',
          'Where surgery and radiotherapy are both plausible first steps.',
          'When a clinical trial has been mentioned but not explained.',
          'If the plan has not been discussed at a multidisciplinary tumour board.',
          'Whenever you simply do not feel you have understood the reasoning.',
        ],
      },
      { type: 'quote', text: 'A plan that cannot survive a second reading was not a strong plan.' },
      { type: 'h', text: 'How to do it efficiently' },
      {
        type: 'p',
        text: 'Ask your treating team for the pathology report, the imaging on disc or portal link, and a summary letter. Most centres, ours included, will review a documented case within five working days. Crucially, this rarely delays treatment: the diagnostic work-up continues in parallel.',
      },
      {
        type: 'p',
        text: 'Where the second opinion agrees, you begin treatment with confidence. Where it differs, the two teams should speak directly — and in our experience, they nearly always converge once they do.',
      },
    ],
  },
  {
    slug: 'sleep-and-metabolic-health',
    title: 'Sleep is a metabolic treatment we routinely under-prescribe',
    excerpt:
      'Short sleep raises insulin resistance within days. An endocrinologist on the clinical case for taking rest seriously.',
    category: 'Preventive Health',
    readingTime: 6,
    date: '2026-06-12',
    author: 'Dr Clara Jiménez',
    authorSlug: 'clara-jimenez',
    art: 'internal',
    featured: false,
    body: [
      {
        type: 'p',
        text: 'In controlled studies, restricting healthy volunteers to four hours of sleep for less than a week produces measurable insulin resistance — a shift comparable to a substantial weight gain, achieved in days and reversed as quickly by restoring sleep.',
      },
      { type: 'h', text: 'What happens overnight' },
      {
        type: 'p',
        text: 'Deep sleep is when growth hormone is released, when cortisol falls to its daily minimum, and when the brain clears metabolic waste. Truncating it raises evening cortisol, increases appetite signalling through ghrelin, blunts leptin, and reliably shifts food choice towards refined carbohydrate the following day.',
      },
      { type: 'quote', text: 'We ask patients to change their diet before we ask whether they are sleeping. That order is often wrong.' },
      { type: 'h', text: 'A practical prescription' },
      {
        type: 'list',
        items: [
          'Anchor the wake time first — it stabilises the rhythm more reliably than bedtime.',
          'Daylight within an hour of waking, ideally outdoors and without sunglasses.',
          'No caffeine after early afternoon; its half-life is around six hours.',
          'Keep the bedroom cool — core temperature must fall for sleep to begin.',
          'If you cannot sleep after twenty minutes, get up. Beds should not become places of frustration.',
        ],
      },
      {
        type: 'p',
        text: 'Persistent snoring with daytime sleepiness deserves formal assessment for obstructive sleep apnoea, which is both common and eminently treatable — and which quietly undermines blood pressure and glucose control in a great many patients.',
      },
    ],
  },
]

export const getArticle = (slug) => articles.find((a) => a.slug === slug)
