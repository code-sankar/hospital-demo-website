# Vitalis Medical Centre — hospital & healthcare demo website

A complete, production-shaped demo website for hospitals, clinics and healthcare
centres — built to be shown in a pitch and then rebranded for the client who
says yes.

The design leans European: a refined serif display face, a deep clinical green
and warm parchment palette, brass hairlines, generous whitespace and a recurring
architectural arch motif. It is deliberately not the usual blue-and-white
hospital template.

**Stack:** Vite 8 · React 19 · Tailwind CSS 4 · React Router 7 · Motion · Lucide

---

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
npm run preview  # serve the production build
npm run lint     # ESLint
```

Node 20+ recommended (developed on Node 22).

---

## What is in the demo

| Route | Page |
| --- | --- |
| `/` | Home — hero, quick actions, accreditations, specialities, differentiators, statistics, care pathway, consultants, technology, testimonials, insights, emergency band |
| `/about` | Founding story, values, 100-year timeline, leadership, published outcomes |
| `/centres` | Searchable directory of the 13 centres of excellence |
| `/centres/:slug` | Full speciality page — overview, treatments, pathway, technology, team, FAQs |
| `/doctors` | Consultant directory with search, speciality/language filters and sorting |
| `/doctors/:slug` | Consultant profile — biography, training, memberships, clinic times |
| `/patients` | Planning a visit, visiting hours, admissions & billing, health packages, international patients, FAQs |
| `/appointment` | Four-step booking wizard with validation and a confirmation screen |
| `/insights` | Health articles with category filtering |
| `/insights/:slug` | Long-form article with author card and related reading |
| `/contact` | Departmental contacts, message form, location and travel information |
| `/careers` | Employer proposition and current vacancies |
| `*` | A 404 page that routes people back to what they were looking for |

Also included: a sticky header with a mega-menu, a full-screen mobile drawer, a
thumb-reachable mobile action bar, scroll-reveal animations that respect
`prefers-reduced-motion`, skip-to-content, and a visible focus style throughout.

---

## Rebranding it for a client

Almost everything a prospect will ask you to change lives in `src/data/`.

| File | Contains |
| --- | --- |
| `site.js` | Name, tagline, phone numbers, address, opening hours, navigation, headline statistics, accreditations |
| `departments.js` | The centres of excellence — each object generates a card, a route, a detail page and its FAQs |
| `doctors.js` | The consultant directory and every profile page |
| `patients.js` | Visit planning, visiting hours, insurers, health packages, international services, FAQs |
| `articles.js` | Health Insights articles (body is a simple block array: `p`, `h`, `quote`, `list`) |
| `testimonials.js` | Patient quotes |
| `about.js` | Timeline, values, leadership, published outcomes, vacancies |

Adding a department to `departments.js` is enough to create its card, its route
at `/centres/<slug>`, its detail page and its footer link — nothing else needs
editing.

### Colours and type

Both are declared once as Tailwind v4 theme tokens at the top of
`src/index.css`, inside `@theme`. Change `--color-pine-*`, `--color-brass-*`,
`--color-ivory` and the two `--font-*` variables and the whole site follows.
The Google Fonts link lives in `index.html`.

---

## About the artwork

Every image on this site is generated SVG rather than photography:

- `src/components/art/ArtPanel.jsx` — the panels behind headers, cards and
  section bands. Pass a `variant` (a medical motif such as `cardio`, `neuro`,
  `ortho`, or an architectural one such as `atrium`, `colonnade`, `courtyard`),
  a `tone` and a `seed`.
- `src/components/art/motifs.js` — the motif geometry, one generator per variant.
- `src/components/art/Portrait.jsx` — the arch-framed illustrated consultant
  portraits, drawn deterministically from each person's `seed`.
- `src/components/art/Logo.jsx` — the arch-and-cross mark and wordmark.

This was a deliberate choice for a pitch tool: the site weighs almost nothing,
renders identically every time, and can never show a broken image or an
unlicensed stock photo in front of a client. Every panel is deterministic — the
same `variant` and `seed` always produce the same picture.

### Swapping in real photography

When a client provides their own images, replace the `<ArtPanel />` or
`<Portrait />` element with an `<img>`. The containers already handle the
cropping, so only the element itself changes:

```jsx
// before
<ArtPanel variant={department.art} tone="pine" seed={4} arch={false} />

// after
<img src={department.photo} alt="" className="h-full w-full object-cover" />
```

Add the corresponding `photo` field to the matching object in `src/data/`.
Decorative images should keep `alt=""`; anything carrying meaning needs a real
description.

---

## Project structure

```
src/
├── components/
│   ├── art/        ArtPanel, Portrait, Logo, motif geometry
│   ├── layout/     Header, mega-menu, mobile drawer, footer, page chrome
│   ├── sections/   Hero, cards, statistics, testimonials, CTA bands
│   └── ui/         Container, Reveal, SectionHeading, Accordion, Counter,
│                   Breadcrumbs, form fields, social glyphs
├── data/           All editable content (see rebranding above)
├── lib/            Seeded RNG, icon registry
├── pages/          One file per route
├── App.jsx         Routes; every page but the home page is code-split
└── index.css       Design tokens, base styles, utilities
```

Button and badge styles are written as utility classes at each call site rather
than behind a component. If you are extending this into a long-lived client
project, extracting them is the first refactor worth doing.

---

## Notes for the pitch

- **Nothing is submitted anywhere.** The booking wizard and the contact form
  validate, show a realistic confirmation and then stop. No network requests, no
  data leaves the browser. Both screens say so in plain language.
- **The content is fictional.** Vitalis is an invented institution; the
  consultants, outcomes, accreditations and contact details are illustrative,
  and the footer states this. Replace them before any public deployment.
- **Deployment** is a static build — `npm run build` produces `dist/`, which
  drops straight onto Netlify, Vercel, Cloudflare Pages or any static host.
  Configure the host to rewrite unknown paths to `index.html` so the client-side
  routes resolve on a hard refresh.
