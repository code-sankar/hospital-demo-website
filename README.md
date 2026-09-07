# Ashvini Institute of Medical Sciences

A full-stack hospital website: a public site patients book through, a console
each consultant uses to run their own diary, and a counter console the front
desk uses to identify patients from a ticket code.

**European design, Indian content.** The visual language is deliberately
European-editorial — a refined serif display face, a deep clinical green and
warm parchment palette, brass hairlines and a recurring architectural arch
motif. The content is entirely Indian: a Bengaluru campus, NABH and JCI
accreditation, DM / MCh / DNB qualifications, cashless TPA billing, ₹ pricing
and 108 for the ambulance.

**Stack** — React 19 · Vite 8 · Tailwind CSS 4 · Express 5 · PostgreSQL
(Supabase) · Razorpay · Nodemailer

---

## What it does

**Patients** choose a speciality and a consultant, see that consultant's genuine
free slots, pay the consultation fee in full, and receive a ticket code by
email. Nothing is provisional: the fee is taken before the booking is confirmed
and is not refundable.

**Consultants** sign in and run their own diary — weekly consulting hours, slot
length, leave, and a single switch that closes the diary to new bookings. The
public booking page follows immediately; there is nobody to tell.

**The counter** receives a copy of every ticket by email and can look any
booking up by its code. The patient says `ASH-7K3M-9QX2`, the desk sees who they
are, who they are seeing and what they paid, and checks them in.

---

## Running it locally

You need Node 20+ and a PostgreSQL database. A free Supabase project is the
quickest route; any Postgres 14+ will do.

```bash
git clone <this repo> && cd hospital-demo-website
npm install

cp .env.example .env      # then fill in DATABASE_URL and JWT_SECRET
npm run migrate           # build the schema
npm run seed              # departments, 18 consultants, rotas, demo bookings

npm run dev               # API on :4000, site on :5173
```

Open http://localhost:5173. Vite proxies `/api` to the server, so the session
cookie is first-party in development exactly as it is in production.

| Command | |
| --- | --- |
| `npm run dev` | API and web together |
| `npm run migrate` | Apply pending migrations (also runs at server boot) |
| `npm run seed` | Idempotent demo data — safe to re-run |
| `npm test` | 52 API tests against a real Postgres |
| `npm run lint` | ESLint across both workspaces |
| `npm run build` | Production build of the front end |

### Getting a database from Supabase

1. Create a project at supabase.com.
2. **Project Settings → Database → Connection string → URI**, and put it in
   `DATABASE_URL`. Replace `[YOUR-PASSWORD]` with the database password.
   Use the direct string for a long-running server; the pooled one on port
   6543 if you deploy to something serverless.
3. `npm run migrate` builds the schema. TLS is switched on automatically for
   Supabase hosts.

The server talks to Postgres directly over `pg` rather than through Supabase's
REST layer. Express is the only client, so it holds the credentials and enforces
every rule in one place — there is no second authorisation model to keep in step.

### Demo sign-ins

Seeded, flagged “must change password”, and printed by `npm run seed`:

| Role | Email | Password |
| --- | --- | --- |
| Consultant | `ananya-iyer@ashvini-health.example` | `Doctor@12345` |
| Consultant | any `<doctor-slug>@ashvini-health.example` | `Doctor@12345` |
| Counter | `counter@ashvini-health.example` | `Counter@12345` |
| Admin | `admin@ashvini-health.example` | `Admin@12345` |

---

## Payments and email out of the box

Both default to a local stand-in so the whole flow works before you have any
accounts, and both are one environment variable away from being real.

**`PAYMENT_PROVIDER=mock`** creates orders and verifies a deterministic
signature through the same code path the real gateway uses. It never moves
money and refuses to start when `NODE_ENV=production`. Set
`PAYMENT_PROVIDER=razorpay` with your key, secret and webhook secret to take
live payments; point the Razorpay webhook at `/api/payments/webhook` and
subscribe to `payment.captured` and `payment.failed`.

**`MAIL_TRANSPORT=file`** writes each message to `server/.mailbox` as an `.eml`
you can open in any mail client — useful for checking the ticket actually
renders. Set `MAIL_TRANSPORT=smtp` with your SMTP details to send for real.

`COUNTER_INBOX` is the address the counter's copy of every ticket goes to.

---

## How the booking is kept honest

**Availability is computed, not stored.** A consultant records weekly hours as
local wall-clock time (“Tuesday, 10:00–13:00”). Slots are generated from those
rules in Postgres, because only the database has the timezone rules to turn
local time into a correct instant — which will matter the first time this is
used outside India.

**Two people cannot take the same slot.** The `appointments` table carries an
exclusion constraint rejecting any overlapping booking for a consultant. The
guarantee comes from the database, not from application logic that might be
running in another process. Four simultaneous requests for one slot produce one
booking and three refusals; there is a test for exactly that.

**Payment and confirmation are one transaction.** A slot is held as
`pending_payment` for ten minutes while the patient pays, and the hold is only
lifted in the same transaction that records the payment. Abandoned checkouts are
swept back into circulation.

**Confirmation is idempotent.** A patient who closes the tab mid-payment is
covered by the gateway webhook; the browser redirect and the webhook can both
arrive and only one ticket is issued.

**A paid appointment survives its consultant's leave.** Recording an absence
reports the bookings that fall inside it rather than cancelling them — those
patients have paid, so a person decides what happens next.

**The fee is non-refundable, and that is recorded.** The terms in force are
stamped on the payment row and on the ticket, not merely asserted by whatever
the website says today.

---

## Project structure

```
├── client/                    React front end
│   └── src/
│       ├── api/               fetch client, formatters
│       ├── auth/              staff session context and route guard
│       ├── components/        design system, layout, generated SVG artwork
│       ├── data/              marketing content; live-doctor hooks
│       └── pages/
│           ├── booking/       slot picker, payment hook
│           └── staff/         consultant and counter consoles
└── server/                    Express API
    └── src/
        ├── db/                pool, migrations, seed
        ├── routes/            auth, catalogue, appointments, payments,
        │                      doctor, counter
        ├── services/          slots, appointments, payments, tickets, mailer
        └── middleware/        auth, validation, errors
```

### The API

| | |
| --- | --- |
| `GET /api/departments` | Specialities |
| `GET /api/doctors` | Directory; filter by department, language, availability |
| `GET /api/doctors/:slug/slots` | Genuine free slots |
| `POST /api/appointments/hold` | Reserve a slot and open a payment order |
| `POST /api/appointments/:id/confirm` | Verify payment, confirm, issue the ticket |
| `POST /api/payments/webhook` | Gateway callback (raw body, signature checked) |
| `GET /api/tickets/:code` | Public ticket view — the code is the credential |
| `POST /api/auth/login` `logout` `me` | Staff session, httpOnly cookie |
| `GET/PATCH /api/doctor/me` | Profile, slot length, accepting on/off |
| `PUT /api/doctor/availability` | Replace the weekly rota |
| `POST/DELETE /api/doctor/time-off` | Leave |
| `GET /api/counter/tickets/:code` | Identify a patient at the desk |
| `POST /api/counter/tickets/:code/check-in` | Check in |
| `GET /api/counter/queue` | The day's list |

---

## Security notes

Sessions are JWTs in `httpOnly`, `SameSite=Lax` cookies, so no token is ever
reachable from JavaScript. Passwords are bcrypt. Sign-in, booking and ticket
lookup are rate limited, and a wrong address takes the same time to answer as a
wrong password. Every request re-reads the account, so deactivating a login takes
effect immediately rather than when its token happens to expire. Money is stored
in paise as integers. Request bodies are parsed by schema and the parsed value
replaces the original, so no unexpected field reaches a query.

---

## Rebranding it for a client

Marketing content lives in `client/src/data/` — `site.js` for the name, phone
numbers and address, `departments.js`, `doctors.js`, `articles.js` and the rest.
Colours and typography are Tailwind theme tokens at the top of
`client/src/index.css`. The seed reads `departments.js` and `doctors.js`
directly, so the database and the brochure cannot disagree.

Every image is generated SVG rather than photography — the site weighs almost
nothing, renders identically every time, and cannot show a broken image or an
unlicensed stock photo in front of a client. `client/src/components/art/`
explains how to swap in a client's own pictures.

---

## Before this goes anywhere near a real patient

- **The content is fictional.** Ashvini is invented; the consultants, outcomes
  and accreditations are illustrative. NABH, NABL and JCI claims are regulated —
  only a client who actually holds them may display them.
- **Patient data is regulated.** What this collects falls under the DPDP Act
  2023. Consent wording, retention and a privacy notice need a lawyer, not a
  template.
- **A non-refundable fee is a contract term.** Have it reviewed, make it
  conspicuous before payment (it is, on the review step and the ticket), and
  decide the exceptions you will honour in practice.
- **Change every seeded password**, set a real `JWT_SECRET`
  (`openssl rand -hex 48`), and serve over HTTPS so the session cookie is
  `Secure`.
- **Bookings are the money path.** Take backups, and switch
  `PAYMENT_PROVIDER=razorpay` well before launch so the webhook is exercised.
