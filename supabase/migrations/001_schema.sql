-- MineralWallet Database Schema
-- All monetary amounts stored as INTEGER (centavos) to avoid floating point issues

-- ============================================================
-- PROFILES (extends Supabase Auth)
-- ============================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  legajo TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  categoria TEXT NOT NULL DEFAULT 'Operador',
  mina TEXT NOT NULL DEFAULT '',
  empresa TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  antiguedad INTEGER NOT NULL DEFAULT 0,
  biometric_enrolled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- WALLETS (one per user)
-- ============================================================
CREATE TABLE wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  balance INTEGER NOT NULL DEFAULT 0,
  savings INTEGER NOT NULL DEFAULT 0,
  usdt_balance NUMERIC(18,8) NOT NULL DEFAULT 0,
  usdt_rate INTEGER NOT NULL DEFAULT 100000, -- centavos per USDT
  adelanto_disponible INTEGER NOT NULL DEFAULT 0,
  adelanto_usado INTEGER NOT NULL DEFAULT 0,
  cvu TEXT UNIQUE,
  alias TEXT UNIQUE,
  credit_score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- TRANSACTIONS
-- ============================================================
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  amount INTEGER NOT NULL, -- negative for debits
  type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'transfer')),
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_transactions_wallet_date ON transactions(wallet_id, created_at DESC);

-- ============================================================
-- FAMILY CONTACTS
-- ============================================================
CREATE TABLE family_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  method TEXT NOT NULL DEFAULT 'CBU',
  last_sent_amount INTEGER DEFAULT 0,
  last_sent_date DATE,
  total_sent_year INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- LOANS
-- ============================================================
CREATE TABLE loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  total INTEGER NOT NULL,
  paid INTEGER NOT NULL DEFAULT 0,
  cuota INTEGER NOT NULL,
  next_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paid', 'defaulted')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- SHIFTS
-- ============================================================
CREATE TABLE shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('manana', 'tarde', 'noche')),
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  sector TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT '',
  day_of_rotation INTEGER NOT NULL DEFAULT 1,
  total_days INTEGER NOT NULL DEFAULT 7,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_shifts_user_date ON shifts(user_id, date DESC);

-- ============================================================
-- CHECK-INS
-- ============================================================
CREATE TABLE check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  check_in_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  check_out_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_check_ins_user_date ON check_ins(user_id, check_in_at DESC);

-- ============================================================
-- PAY STUBS
-- ============================================================
CREATE TABLE pay_stubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  period TEXT NOT NULL,
  month TEXT NOT NULL,
  year INTEGER NOT NULL,
  haberes JSONB NOT NULL DEFAULT '[]',
  descuentos JSONB NOT NULL DEFAULT '[]',
  total_haberes INTEGER NOT NULL DEFAULT 0,
  total_descuentos INTEGER NOT NULL DEFAULT 0,
  neto INTEGER NOT NULL DEFAULT 0,
  paid_date DATE,
  pdf_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_pay_stubs_user_year ON pay_stubs(user_id, year DESC, month);

-- ============================================================
-- EPP ITEMS (Personal Protective Equipment)
-- ============================================================
CREATE TABLE epp_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'vigente' CHECK (status IN ('vigente', 'por_vencer', 'vencido', 'no_requerido')),
  expires_at DATE,
  review_date TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- SOS EVENTS
-- ============================================================
CREATE TABLE sos_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  altitude DOUBLE PRECISION,
  accuracy DOUBLE PRECISION,
  type TEXT NOT NULL DEFAULT 'sos' CHECK (type IN ('sos', 'report')),
  status TEXT NOT NULL DEFAULT 'activated' CHECK (status IN ('activated', 'resolved', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_sos_events_user ON sos_events(user_id, created_at DESC);

-- ============================================================
-- EMERGENCY CONTACTS
-- ============================================================
CREATE TABLE emergency_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('family', 'mine', 'medical')),
  label TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- SAFETY TALKS (shared reference data)
-- ============================================================
CREATE TABLE safety_talks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  duration TEXT NOT NULL DEFAULT '5 min',
  date DATE NOT NULL,
  content TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- SAFETY TALK COMPLETIONS
-- ============================================================
CREATE TABLE safety_talk_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  talk_id UUID NOT NULL REFERENCES safety_talks(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, talk_id)
);

-- ============================================================
-- SAFETY PROFILES (aggregated safety metrics per user)
-- ============================================================
CREATE TABLE safety_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  safety_score INTEGER NOT NULL DEFAULT 0,
  incident_count INTEGER NOT NULL DEFAULT 0,
  consecutive_talks INTEGER NOT NULL DEFAULT 0,
  epp_compliance_percent INTEGER NOT NULL DEFAULT 0,
  last_sos_test DATE,
  completed_courses INTEGER NOT NULL DEFAULT 0,
  total_courses INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- HEALTH LOGS
-- ============================================================
CREATE TABLE health_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('hydration', 'mood', 'metrics')),
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_health_logs_user_type ON health_logs(user_id, type, created_at DESC);

-- ============================================================
-- HEALTH PROFILES (aggregated health metrics per user)
-- ============================================================
CREATE TABLE health_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  fatigue_level TEXT NOT NULL DEFAULT 'optimo' CHECK (fatigue_level IN ('optimo', 'precaucion', 'riesgo')),
  readiness_score INTEGER NOT NULL DEFAULT 0,
  sleep_hours NUMERIC(4,2) NOT NULL DEFAULT 0,
  shift_load TEXT NOT NULL DEFAULT 'Normal',
  hydration_current INTEGER NOT NULL DEFAULT 0,
  hydration_goal INTEGER NOT NULL DEFAULT 4000,
  temperature NUMERIC(4,1) NOT NULL DEFAULT 36.5,
  apto_vigente TEXT NOT NULL DEFAULT '',
  heart_rate INTEGER NOT NULL DEFAULT 0,
  steps INTEGER NOT NULL DEFAULT 0,
  deep_sleep NUMERIC(4,2) NOT NULL DEFAULT 0,
  sleep_quality TEXT NOT NULL DEFAULT '',
  mood_today INTEGER,
  days_away_from_home INTEGER NOT NULL DEFAULT 0,
  days_until_return INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- MEDICAL EXAMS
-- ============================================================
CREATE TABLE medical_exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  date DATE NOT NULL,
  location TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'completado')),
  result TEXT,
  preparation JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- BENEFIT CATEGORIES (shared reference data)
-- ============================================================
CREATE TABLE benefit_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  discount TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#C87533',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- NEARBY BUSINESSES (shared reference data)
-- ============================================================
CREATE TABLE nearby_businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  discount TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL DEFAULT 0,
  longitude DOUBLE PRECISION NOT NULL DEFAULT 0,
  distance TEXT NOT NULL DEFAULT '', -- pre-calculated display string
  has_qr BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- SAVINGS ENTRIES (benefit redemptions)
-- ============================================================
CREATE TABLE savings_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  store TEXT NOT NULL,
  amount INTEGER NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_savings_entries_user ON savings_entries(user_id, created_at DESC);

-- ============================================================
-- CAREER PROFILES (aggregated career metrics per user)
-- ============================================================
CREATE TABLE career_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  level TEXT NOT NULL DEFAULT 'Operador',
  next_level TEXT NOT NULL DEFAULT '',
  xp_current INTEGER NOT NULL DEFAULT 0,
  xp_required INTEGER NOT NULL DEFAULT 1000,
  certificates_needed INTEGER NOT NULL DEFAULT 0,
  position_change INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- CERTIFICATES
-- ============================================================
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  issued_by TEXT NOT NULL DEFAULT '',
  date DATE,
  expires_at DATE,
  status TEXT NOT NULL DEFAULT 'en_curso' CHECK (status IN ('vigente', 'vencido', 'en_curso')),
  progress INTEGER NOT NULL DEFAULT 0,
  xp_reward INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- COURSES (shared reference data)
-- ============================================================
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  hours INTEGER NOT NULL DEFAULT 0,
  xp_reward INTEGER NOT NULL DEFAULT 0,
  difficulty TEXT NOT NULL DEFAULT 'basico' CHECK (difficulty IN ('basico', 'intermedio', 'avanzado')),
  type TEXT NOT NULL DEFAULT 'voluntario' CHECK (type IN ('obligatorio', 'recomendado', 'voluntario')),
  validity TEXT NOT NULL DEFAULT '1 ano',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- COURSE PROGRESS (per user)
-- ============================================================
CREATE TABLE course_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  progress INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL CHECK (category IN ('plata', 'turnos', 'seguridad', 'salud', 'beneficios')),
  read BOOLEAN NOT NULL DEFAULT false,
  action_route TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON notifications(user_id) WHERE read = false;

-- ============================================================
-- PUSH TOKENS
-- ============================================================
CREATE TABLE push_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('ios', 'android')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, token)
);

-- ============================================================
-- SUPERVISORS (reference data)
-- ============================================================
CREATE TABLE supervisors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Supervisor de Turno',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- FEATURED BENEFITS (reference data, managed by admin)
-- ============================================================
CREATE TABLE featured_benefits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  max_amount INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_wallets_updated_at BEFORE UPDATE ON wallets FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_safety_profiles_updated_at BEFORE UPDATE ON safety_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_health_profiles_updated_at BEFORE UPDATE ON health_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_career_profiles_updated_at BEFORE UPDATE ON career_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ATOMIC TRANSFER FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION transfer_funds(
  p_from_wallet_id UUID,
  p_to_wallet_id UUID,
  p_amount INTEGER,
  p_title TEXT,
  p_description TEXT DEFAULT NULL,
  p_category TEXT DEFAULT 'transfer'
)
RETURNS UUID AS $$
DECLARE
  v_tx_id UUID;
  v_from_balance INTEGER;
BEGIN
  -- Check sender balance
  SELECT balance INTO v_from_balance FROM wallets WHERE id = p_from_wallet_id FOR UPDATE;
  IF v_from_balance < p_amount THEN
    RAISE EXCEPTION 'Saldo insuficiente';
  END IF;

  -- Debit sender
  UPDATE wallets SET balance = balance - p_amount WHERE id = p_from_wallet_id;

  -- Credit receiver
  UPDATE wallets SET balance = balance + p_amount WHERE id = p_to_wallet_id;

  -- Create debit transaction
  INSERT INTO transactions (wallet_id, title, description, amount, type, category)
  VALUES (p_from_wallet_id, p_title, p_description, -p_amount, 'transfer', p_category)
  RETURNING id INTO v_tx_id;

  -- Create credit transaction
  INSERT INTO transactions (wallet_id, title, description, amount, type, category)
  VALUES (p_to_wallet_id, 'Transferencia recibida', p_description, p_amount, 'income', p_category);

  RETURN v_tx_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- ADELANTO (SALARY ADVANCE) FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION request_adelanto(
  p_wallet_id UUID,
  p_amount INTEGER
)
RETURNS UUID AS $$
DECLARE
  v_disponible INTEGER;
  v_tx_id UUID;
BEGIN
  SELECT adelanto_disponible - adelanto_usado INTO v_disponible
  FROM wallets WHERE id = p_wallet_id FOR UPDATE;

  IF v_disponible < p_amount THEN
    RAISE EXCEPTION 'Monto excede el adelanto disponible';
  END IF;

  UPDATE wallets
  SET balance = balance + p_amount,
      adelanto_usado = adelanto_usado + p_amount
  WHERE id = p_wallet_id;

  INSERT INTO transactions (wallet_id, title, amount, type, category)
  VALUES (p_wallet_id, 'Adelanto de sueldo', p_amount, 'income', 'advance')
  RETURNING id INTO v_tx_id;

  RETURN v_tx_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- USDT CONVERSION FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION convert_usdt(
  p_wallet_id UUID,
  p_ars_amount INTEGER,
  p_direction TEXT -- 'buy' or 'sell'
)
RETURNS VOID AS $$
DECLARE
  v_rate INTEGER;
  v_usdt_amount NUMERIC(18,8);
BEGIN
  SELECT usdt_rate INTO v_rate FROM wallets WHERE id = p_wallet_id FOR UPDATE;
  v_usdt_amount := p_ars_amount::NUMERIC / v_rate;

  IF p_direction = 'buy' THEN
    UPDATE wallets
    SET balance = balance - p_ars_amount,
        usdt_balance = usdt_balance + v_usdt_amount
    WHERE id = p_wallet_id AND balance >= p_ars_amount;

    IF NOT FOUND THEN RAISE EXCEPTION 'Saldo insuficiente'; END IF;

    INSERT INTO transactions (wallet_id, title, amount, type, category)
    VALUES (p_wallet_id, 'Compra USDT', -p_ars_amount, 'expense', 'crypto');
  ELSE
    UPDATE wallets
    SET balance = balance + p_ars_amount,
        usdt_balance = usdt_balance - v_usdt_amount
    WHERE id = p_wallet_id AND usdt_balance >= v_usdt_amount;

    IF NOT FOUND THEN RAISE EXCEPTION 'Saldo USDT insuficiente'; END IF;

    INSERT INTO transactions (wallet_id, title, amount, type, category)
    VALUES (p_wallet_id, 'Venta USDT', p_ars_amount, 'income', 'crypto');
  END IF;
END;
$$ LANGUAGE plpgsql;
