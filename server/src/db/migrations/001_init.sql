-- ---------------------------------------------------------------------------
-- Ashvini Institute of Medical Sciences — initial schema
--
-- Money is stored in paise (integer) throughout. Never floats for currency.
-- Times of day in doctor_availability are clinic-local wall clock; they are
-- resolved to absolute instants against config.clinic.timezone at query time,
-- which is what makes the schedule correct across any timezone or DST rule.
-- ---------------------------------------------------------------------------

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- --- accounts ---------------------------------------------------------------

CREATE TABLE IF NOT EXISTS users (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email                text NOT NULL,
  password_hash        text NOT NULL,
  role                 text NOT NULL CHECK (role IN ('doctor', 'counter', 'admin')),
  full_name            text NOT NULL,
  is_active            boolean NOT NULL DEFAULT true,
  must_change_password boolean NOT NULL DEFAULT false,
  last_login_at        timestamptz,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS users_email_key ON users (lower(email));

-- --- catalogue --------------------------------------------------------------

CREATE TABLE IF NOT EXISTS departments (
  slug       text PRIMARY KEY,
  name       text NOT NULL,
  tagline    text,
  sort_order integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS doctors (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               uuid UNIQUE REFERENCES users (id) ON DELETE SET NULL,
  slug                  text NOT NULL UNIQUE,
  full_name             text NOT NULL,
  title                 text NOT NULL,
  department_slug       text NOT NULL REFERENCES departments (slug) ON UPDATE CASCADE,
  focus                 text[] NOT NULL DEFAULT '{}',
  languages             text[] NOT NULL DEFAULT '{}',
  qualifications        text[] NOT NULL DEFAULT '{}',
  memberships           text[] NOT NULL DEFAULT '{}',
  bio                   text NOT NULL DEFAULT '',
  experience_years      integer NOT NULL DEFAULT 0,
  consultation_fee_paise integer NOT NULL CHECK (consultation_fee_paise > 0),
  slot_minutes          integer NOT NULL DEFAULT 15 CHECK (slot_minutes BETWEEN 5 AND 120),
  -- The doctor's own master switch. Off means no new bookings, whatever the rota says.
  is_accepting          boolean NOT NULL DEFAULT true,
  portrait_seed         integer NOT NULL DEFAULT 1,
  initials              text NOT NULL DEFAULT '',
  rating                numeric(2,1),
  review_count          integer NOT NULL DEFAULT 0,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS doctors_department_idx ON doctors (department_slug);

-- --- the rota ---------------------------------------------------------------

-- Recurring weekly consulting hours. weekday follows Postgres EXTRACT(dow):
-- 0 = Sunday through 6 = Saturday.
CREATE TABLE IF NOT EXISTS doctor_availability (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id  uuid NOT NULL REFERENCES doctors (id) ON DELETE CASCADE,
  weekday    smallint NOT NULL CHECK (weekday BETWEEN 0 AND 6),
  starts_at  time NOT NULL,
  ends_at    time NOT NULL,
  is_active  boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT doctor_availability_range_ck CHECK (ends_at > starts_at)
);
CREATE INDEX IF NOT EXISTS doctor_availability_doctor_idx ON doctor_availability (doctor_id, weekday);

-- Absences that override the weekly rota: leave, conferences, theatre lists.
CREATE TABLE IF NOT EXISTS doctor_time_off (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id  uuid NOT NULL REFERENCES doctors (id) ON DELETE CASCADE,
  starts_at  timestamptz NOT NULL,
  ends_at    timestamptz NOT NULL,
  reason     text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT doctor_time_off_range_ck CHECK (ends_at > starts_at)
);
CREATE INDEX IF NOT EXISTS doctor_time_off_doctor_idx ON doctor_time_off (doctor_id, starts_at, ends_at);

-- --- patients and appointments ---------------------------------------------

CREATE TABLE IF NOT EXISTS patients (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name     text NOT NULL,
  email         text NOT NULL,
  phone         text NOT NULL,
  date_of_birth date,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS patients_identity_key ON patients (lower(email), phone);

DO $$ BEGIN
  CREATE TYPE appointment_status AS ENUM
    ('pending_payment', 'confirmed', 'cancelled', 'completed', 'no_show', 'expired');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS appointments (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- The ticket code the patient quotes at the counter. Generated up front but
  -- only disclosed once payment has cleared.
  reference         text NOT NULL UNIQUE,
  doctor_id         uuid NOT NULL REFERENCES doctors (id) ON DELETE RESTRICT,
  patient_id        uuid NOT NULL REFERENCES patients (id) ON DELETE RESTRICT,
  starts_at         timestamptz NOT NULL,
  ends_at           timestamptz NOT NULL,
  status            appointment_status NOT NULL DEFAULT 'pending_payment',
  reason            text NOT NULL DEFAULT 'new',
  notes             text NOT NULL DEFAULT '',
  amount_paise      integer NOT NULL CHECK (amount_paise > 0),
  -- Payment is taken in full and in advance; nothing here is refundable.
  hold_expires_at   timestamptz,
  confirmed_at      timestamptz,
  checked_in_at     timestamptz,
  checked_in_by     uuid REFERENCES users (id) ON DELETE SET NULL,
  cancelled_at      timestamptz,
  cancelled_reason  text,
  terms_accepted_at timestamptz NOT NULL,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT appointments_range_ck CHECK (ends_at > starts_at)
);

-- The double-booking guard. Two people racing for the same slot cannot both
-- win: the second INSERT is rejected by the database itself, not by
-- application logic that may be running in another process.
--
-- An exclusion constraint rather than a unique index on (doctor_id, starts_at),
-- because it rejects any OVERLAP — which is what actually matters once a doctor
-- changes their slot length and a new 30-minute slot would swallow an existing
-- 15-minute booking.
CREATE EXTENSION IF NOT EXISTS btree_gist;

DO $$ BEGIN
  ALTER TABLE appointments ADD CONSTRAINT appointments_no_overlap
    EXCLUDE USING gist (
      doctor_id WITH =,
      tstzrange(starts_at, ends_at) WITH &&
    ) WHERE (status IN ('pending_payment', 'confirmed'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS appointments_doctor_window_idx ON appointments (doctor_id, starts_at);
CREATE INDEX IF NOT EXISTS appointments_status_idx ON appointments (status, starts_at);
CREATE INDEX IF NOT EXISTS appointments_hold_idx ON appointments (hold_expires_at) WHERE status = 'pending_payment';

-- --- money ------------------------------------------------------------------

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('created', 'paid', 'failed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS payments (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id      uuid NOT NULL REFERENCES appointments (id) ON DELETE CASCADE,
  provider            text NOT NULL,
  provider_order_id   text NOT NULL,
  provider_payment_id text,
  provider_signature  text,
  amount_paise        integer NOT NULL CHECK (amount_paise > 0),
  currency            text NOT NULL DEFAULT 'INR',
  status              payment_status NOT NULL DEFAULT 'created',
  -- Recorded on the row so the terms in force at the time of payment are
  -- evidenced, not merely asserted by today's copy on the website.
  refund_policy       text NOT NULL DEFAULT 'non_refundable',
  paid_at             timestamptz,
  failure_reason      text,
  raw                 jsonb,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS payments_provider_order_key ON payments (provider, provider_order_id);
CREATE INDEX IF NOT EXISTS payments_appointment_idx ON payments (appointment_id);

-- --- ticket delivery audit --------------------------------------------------

CREATE TABLE IF NOT EXISTS ticket_deliveries (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid NOT NULL REFERENCES appointments (id) ON DELETE CASCADE,
  channel        text NOT NULL CHECK (channel IN ('email_patient', 'email_counter')),
  recipient      text NOT NULL,
  status         text NOT NULL CHECK (status IN ('sent', 'failed')),
  error          text,
  sent_at        timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ticket_deliveries_appointment_idx ON ticket_deliveries (appointment_id);

CREATE TABLE IF NOT EXISTS audit_log (
  id            bigserial PRIMARY KEY,
  actor_user_id uuid REFERENCES users (id) ON DELETE SET NULL,
  action        text NOT NULL,
  entity        text,
  entity_id     text,
  meta          jsonb,
  created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS audit_log_entity_idx ON audit_log (entity, entity_id);

-- --- updated_at maintenance -------------------------------------------------

CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['users','doctors','doctor_availability','patients','appointments','payments']
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS %I_set_updated_at ON %I', t, t);
    EXECUTE format(
      'CREATE TRIGGER %I_set_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION set_updated_at()',
      t, t);
  END LOOP;
END $$;
