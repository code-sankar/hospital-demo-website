export const articles = [
  {
    slug: 'reading-your-blood-pressure',
    title: 'What your blood pressure reading is actually telling you',
    excerpt:
      'Two numbers, a great deal of anxiety, and a surprising amount of nuance. A cardiologist explains what the figures mean and when they matter.',
    category: 'Heart Health',
    readingTime: 6,
    date: '2026-08-24',
    author: 'Dr Ananya Iyer',
    authorSlug: 'ananya-iyer',
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
        text: 'For most adults, a reading consistently below 120/80 mmHg is optimal. Between 120/80 and 139/89 sits a grey zone where diet, salt and weight change alone often bring the numbers back. Readings of 140/90 or above, confirmed on more than one occasion, meet the threshold for hypertension.',
      },
      {
        type: 'p',
        text: 'India has a particular problem here, and it is not the diagnosis — it is everything after it. Large national surveys keep finding roughly the same pattern: about a quarter of adults have high blood pressure, only half of them know it, and only about one in ten has it properly controlled. The gap is almost entirely a follow-up gap.',
      },
      {
        type: 'quote',
        text: 'A single high reading in a clinic corridor is not a diagnosis. It is an invitation to measure properly.',
      },
      { type: 'h', text: 'Why one reading is never enough' },
      {
        type: 'p',
        text: 'Blood pressure varies through the day by as much as 30 mmHg. It rises with coffee, with a full bladder, with a rushed autorickshaw ride through traffic, and — famously — with the sight of a doctor. White-coat hypertension affects roughly one in five people, which is why we increasingly rely on a week of home readings or 24-hour ambulatory monitoring before starting any medicine.',
      },
      { type: 'h', text: 'Measuring at home, properly' },
      {
        type: 'list',
        items: [
          'Sit quietly for five minutes first, back supported, feet flat on the floor.',
          'Rest your arm on a table so the cuff sits level with your heart.',
          'Use a validated upper-arm monitor. Wrist and finger devices are not reliable enough.',
          'Take two readings a minute apart, morning and evening, for seven days.',
          'Discard the first day entirely — it is almost always the highest.',
          'Bring the whole log to your appointment rather than only the worst number.',
        ],
      },
      { type: 'h', text: 'The salt conversation' },
      {
        type: 'p',
        text: 'Average salt intake in India runs at roughly double the World Health Organization’s recommendation, and most of it does not come from the salt shaker. Pickles, papad, namkeen, packaged masalas, bakery items and restaurant food carry the bulk of it. Cutting added salt at the table is worth perhaps 1–2 mmHg; cutting the processed sources is worth considerably more.',
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
      'Roughly 1.9 million brain cells are lost every minute an artery stays blocked. Here is what happens in our stroke unit, minute by minute.',
    category: 'Neurosciences',
    readingTime: 7,
    date: '2026-08-11',
    author: 'Dr Zoya Siddiqui',
    authorSlug: 'zoya-siddiqui',
    art: 'neuro',
    featured: true,
    body: [
      {
        type: 'p',
        text: 'Stroke is the one emergency where the treatment window is measured not in hours but in minutes of surviving tissue. When a large artery in the brain blocks, the core of the territory dies quickly; a surrounding rim — the penumbra — survives on collateral flow and can still be rescued. Everything we do is designed to reach that rim before it is lost.',
      },
      {
        type: 'p',
        text: 'India records well over a million strokes a year, and the median time from symptom onset to hospital arrival in most Indian studies is measured in hours, not minutes. The treatment has never been the bottleneck. Recognition and transport are.',
      },
      { type: 'h', text: 'Minute 0 — recognition' },
      {
        type: 'p',
        text: 'FAST remains the most useful public test: Face drooping, Arm weakness, Speech difficulty, Time to call. Sudden visual loss, sudden severe unsteadiness and an abrupt worst-ever headache belong on the same list. The instruction is always the same — call 108, do not drive yourself, and do not wait to see whether it settles by morning.',
      },
      {
        type: 'p',
        text: 'One more thing, because we see it constantly: do not go to a nearby clinic first. A hospital without a CT scanner and a stroke pathway cannot help, and the detour routinely costs an hour that cannot be recovered.',
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
        text: 'CT and CT-angiography are performed on the emergency trolley without moving the patient to another department. Within a few minutes we know whether this is a bleed or a clot, and if it is a clot, exactly which vessel is blocked.',
      },
      { type: 'h', text: 'Minute 24 — thrombolysis' },
      {
        type: 'p',
        text: 'Our median door-to-needle time is 24 minutes. Clot-dissolving medication is given in the scanner room itself rather than after transfer to a ward — a small change of geography that removed nine minutes from the pathway.',
      },
      { type: 'h', text: 'Minute 55 — thrombectomy' },
      {
        type: 'p',
        text: 'For a large-vessel blockage, a catheter is passed from the wrist or groin up to the brain and the clot physically retrieved. Available round the clock, this procedure can turn a life-changing disability into a full recovery — but only if the patient reaches us in time.',
      },
      {
        type: 'p',
        text: 'Rehabilitation then begins on day one, not on discharge. The therapy team assesses swallowing, mobility and speech within four hours of admission, because the brain’s window for reorganisation opens immediately and narrows over months.',
      },
    ],
  },
  {
    slug: 'diabetes-at-a-lower-weight',
    title: 'Why Indians develop diabetes at a weight Europeans would call healthy',
    excerpt:
      'The same BMI carries a very different metabolic risk here. An endocrinologist on the thin-fat phenotype, and what to do about it.',
    category: 'Diabetes',
    readingTime: 7,
    date: '2026-07-29',
    author: 'Dr Kavitha Rao',
    authorSlug: 'kavitha-rao',
    art: 'internal',
    featured: false,
    body: [
      {
        type: 'p',
        text: 'One of the more uncomfortable conversations in my clinic goes like this. A patient in his mid-thirties, weight entirely normal on the chart, no family history he knows of, comes in for a routine check. His HbA1c is 6.9%. He has had diabetes for some time and nobody looked.',
      },
      { type: 'h', text: 'The thin-fat phenotype' },
      {
        type: 'p',
        text: 'At any given body mass index, South Asians carry more visceral fat — the fat around the liver, pancreas and intestines — and less muscle than white Europeans. The scales look fine. The metabolism does not. This pattern is visible from birth in Indian babies, who are typically lighter but proportionally fatter than European newborns, and it persists through life.',
      },
      {
        type: 'p',
        text: 'The practical consequence is that the international BMI cut-offs mislead us here. Indian guidelines set overweight at a BMI of 23 rather than 25, and obesity at 25 rather than 30. Waist circumference matters more than either: above 90 cm in men and 80 cm in women, risk climbs sharply regardless of what the weighing scale says.',
      },
      { type: 'quote', text: 'The scales are not lying to you. They are simply answering a different question from the one that matters.' },
      { type: 'h', text: 'What this changes in practice' },
      {
        type: 'list',
        items: [
          'Screen from thirty, not forty — earlier if there is a parent or sibling with diabetes.',
          'Measure your waist at the navel, standing, after breathing out. Track that, not just weight.',
          'Ask for HbA1c rather than fasting sugar alone; fasting sugar misses a great deal of early disease.',
          'Build muscle deliberately. Resistance training twice a week does more for insulin sensitivity here than another hour of walking.',
          'Look hard at refined carbohydrate — the white rice, the maida, the sweetened chai — before you look at fat.',
        ],
      },
      { type: 'h', text: 'The good news, which is real' },
      {
        type: 'p',
        text: 'Prediabetes is not a sentence. In the Indian Diabetes Prevention Programme, structured lifestyle change reduced progression to diabetes by roughly 28% — and that was with modest, achievable changes rather than heroic ones. Where diabetes is already established, sustained weight loss of ten to fifteen per cent puts a meaningful proportion of people into remission, particularly within the first five years of diagnosis.',
      },
      {
        type: 'p',
        text: 'The window is widest early. That is the whole argument for screening at a weight that looks entirely unremarkable.',
      },
    ],
  },
  {
    slug: 'childhood-fever-guide',
    title: 'A parent’s guide to childhood fever — and when it is dengue',
    excerpt:
      'Fever is a defence, not a disease. A paediatrician explains which signs genuinely warrant a hospital visit, and which do not.',
    category: 'Children',
    readingTime: 6,
    date: '2026-07-15',
    author: 'Dr Imran Qureshi',
    authorSlug: 'imran-qureshi',
    art: 'paeds',
    featured: false,
    body: [
      {
        type: 'p',
        text: 'A raised temperature is the immune system doing its job. The number on the thermometer correlates poorly with how serious an illness is — a child at 39.5°C who is drinking, playing and interacting is usually far less worrying than a child at 38.2°C who is limp and refusing fluids.',
      },
      { type: 'h', text: 'Signs that need urgent assessment' },
      {
        type: 'list',
        items: [
          'A rash that does not fade when pressed with the side of a glass.',
          'Breathing that is fast, laboured, or drawing in beneath the ribs.',
          'Unusual drowsiness, or difficulty waking the child.',
          'Any fever at all in a baby under three months of age.',
          'A stiff neck, severe headache or discomfort in bright light.',
          'Fewer than four wet nappies, or no urine for eight hours in an older child.',
        ],
      },
      { type: 'quote', text: 'Watch the child, not the thermometer.' },
      { type: 'h', text: 'When to think dengue' },
      {
        type: 'p',
        text: 'Between June and November in most of India, any fever lasting more than two days deserves a blood count. Dengue typically brings high fever, severe body and joint aches, pain behind the eyes and a flushed appearance. The dangerous phase, counter-intuitively, is not when the fever is highest — it is the day or two after the temperature falls, when plasma can start leaking from the blood vessels.',
      },
      {
        type: 'p',
        text: 'Bring your child in immediately for any of these warning signs: persistent vomiting, severe abdominal pain, bleeding gums or nose, black stools, cold and clammy hands, restlessness or sudden lethargy. And never give ibuprofen, aspirin or combination painkillers when dengue is possible — paracetamol only, because the others worsen bleeding risk.',
      },
      { type: 'h', text: 'What to do at home' },
      {
        type: 'p',
        text: 'Keep fluids going in small, frequent amounts — ORS, coconut water, rice kanji, whatever the child will actually take. Dress them lightly rather than wrapping them. Paracetamol may be used for discomfort, dosed by weight rather than age, and not to chase the number down.',
      },
      {
        type: 'p',
        text: 'One request, and I make it in every consultation: please do not start antibiotics bought over the counter. The overwhelming majority of childhood fevers are viral, antibiotics do nothing for them, and every unnecessary course makes the next real infection harder to treat.',
      },
      {
        type: 'p',
        text: 'Most childhood fevers settle within three to five days. If a fever persists beyond five days, or the child improves and then deteriorates again, that pattern always deserves a review.',
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
        text: 'Patients almost always apologise before asking. They should not. Cancer treatment involves genuine judgement calls — the sequence of therapy, the extent of surgery, whether a trial is appropriate — and reasonable specialists sometimes reach different conclusions from the same scan.',
      },
      { type: 'h', text: 'When a second opinion adds most' },
      {
        type: 'list',
        items: [
          'Rare cancers, where the volume of cases a centre sees genuinely changes outcomes.',
          'Where surgery and radiotherapy are both plausible first steps.',
          'When a clinical trial has been mentioned but not properly explained.',
          'If the plan has not been discussed at a multidisciplinary tumour board.',
          'Whenever you simply do not feel you have understood the reasoning.',
        ],
      },
      { type: 'quote', text: 'A plan that cannot survive a second reading was not a strong plan.' },
      { type: 'h', text: 'How to do it without losing time' },
      {
        type: 'p',
        text: 'Ask your treating team for the biopsy report, the scans on a CD or portal link, and a summary letter. You are entitled to all of it. Most centres, ours included, will review a documented case within five working days, and we accept reports from any hospital in the country.',
      },
      {
        type: 'p',
        text: 'Crucially, this rarely delays treatment: the diagnostic work-up continues in parallel. The fear of losing time is the single most common reason patients talk themselves out of asking, and it is usually misplaced.',
      },
      { type: 'h', text: 'A note on cost' },
      {
        type: 'p',
        text: 'A second opinion consultation costs a fraction of the treatment it is reviewing, and video review means families outside Bengaluru need not travel for it. Where the second opinion agrees, you begin treatment with confidence. Where it differs, the two teams should speak directly — and in our experience, they nearly always converge once they do.',
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
    date: '2026-06-12',
    author: 'Dr Vikram Deshpande',
    authorSlug: 'vikram-deshpande',
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
          'Correction of anaemia, vitamin D and B12 — all three are common here and all three are fixable.',
          'Complete tobacco cessation, in every form. Six weeks is ideal, but any period helps.',
        ],
      },
      { type: 'h', text: 'The protein problem' },
      {
        type: 'p',
        text: 'This is where most of our patients need real help rather than a leaflet. A predominantly vegetarian diet built around rice and one dal often lands well under half the protein target. It is entirely achievable without changing what you eat in principle — more dal and rajma, paneer, curd, sprouts, soya, eggs where acceptable — but it needs planning, which is why our dietitian sees every patient at the pre-assessment visit.',
      },
      { type: 'quote', text: 'The strongest predictor of walking on the day of surgery is how well you were walking a month before it.' },
      { type: 'h', text: 'What it achieves' },
      {
        type: 'p',
        text: 'In our joint replacement cohort, patients completing four weeks of prehabilitation left hospital an average of 0.9 nights earlier, needed less opioid pain relief and reached their six-week function targets a fortnight sooner. Complication rates were lower, particularly chest infections and wound problems.',
      },
      {
        type: 'p',
        text: 'None of this requires a gym membership. Most of the programme can be done at home with a resistance band and a chair, and our physiotherapy team will design it with you at the pre-assessment appointment.',
      },
    ],
  },
]

export const getArticle = (slug) => articles.find((a) => a.slug === slug)
