-- MineralWallet Seed Data
-- Mirrors the mock data currently hardcoded in Zustand stores
-- Run after creating a test user via Supabase Auth dashboard
-- Replace USER_ID with the actual auth.users UUID

-- Usage:
-- 1. Create user in Supabase Auth dashboard (email: carlos@mineralwallet.app, password: test1234)
-- 2. Copy the UUID
-- 3. Replace all occurrences of 'USER_ID_HERE' below
-- 4. Run this seed file

-- For convenience, use a variable (psql only):
-- \set user_id '''your-uuid-here'''

-- ============================================================
-- PROFILE
-- ============================================================
INSERT INTO profiles (id, legajo, nombre, apellido, categoria, mina, empresa, antiguedad)
VALUES (
  'USER_ID_HERE',
  '4521',
  'Carlos',
  'Francesia',
  'Operador Senior A',
  'Minera Alumbrera',
  'Obsidian Mining Co.',
  7
);

-- ============================================================
-- WALLET
-- ============================================================
INSERT INTO wallets (user_id, balance, savings, usdt_balance, usdt_rate, adelanto_disponible, adelanto_usado, cvu, alias, credit_score)
VALUES (
  'USER_ID_HERE',
  84725000,      -- $847,250 en centavos
  12500000,      -- $125,000
  340.00000000,  -- 340 USDT
  100000,        -- $1,000 por USDT (en centavos)
  20000000,      -- $200,000 disponible
  0,
  '0000003100012345678901',
  'MINA.ORO.WALLE',
  92
);

-- ============================================================
-- TRANSACTIONS
-- ============================================================
INSERT INTO transactions (wallet_id, title, description, amount, type, category, created_at)
SELECT w.id, t.title, t.description, t.amount, t.type, t.category, t.created_at
FROM wallets w, (VALUES
  ('Deposito de Nomina', NULL, 42000000, 'income', 'salary', '2026-04-05'::TIMESTAMPTZ),
  ('Comisaria Industrial', NULL, -1250000, 'expense', 'services', '2026-04-04'::TIMESTAMPTZ),
  ('Transferencia a Maria', 'Esposa', -5000000, 'transfer', 'family', '2026-04-03'::TIMESTAMPTZ),
  ('Adelanto de sueldo', NULL, 15000000, 'income', 'advance', '2026-04-01'::TIMESTAMPTZ),
  ('Farmacia Catamarca', 'Beneficio 20%', -450000, 'expense', 'pharmacy', '2026-03-30'::TIMESTAMPTZ),
  ('Bono asistencia perfecta', 'Empresa', 2500000, 'income', 'bonus', '2026-03-28'::TIMESTAMPTZ)
) AS t(title, description, amount, type, category, created_at)
WHERE w.user_id = 'USER_ID_HERE';

-- ============================================================
-- FAMILY CONTACTS
-- ============================================================
INSERT INTO family_contacts (wallet_id, name, relationship, method, last_sent_amount, last_sent_date, total_sent_year)
SELECT w.id, fc.name, fc.relationship, fc.method, fc.last_sent_amount, fc.last_sent_date, fc.total_sent_year
FROM wallets w, (VALUES
  ('Maria', 'Esposa', 'CBU Banco Nacion', 8000000, '2026-04-06'::DATE, 48000000),
  ('Mama', 'Madre', 'Billetera virtual', 3000000, '2026-03-25'::DATE, 18000000),
  ('Hermano', 'Hermano', 'CBU', 1500000, '2026-03-12'::DATE, 9000000)
) AS fc(name, relationship, method, last_sent_amount, last_sent_date, total_sent_year)
WHERE w.user_id = 'USER_ID_HERE';

-- ============================================================
-- LOANS
-- ============================================================
INSERT INTO loans (wallet_id, name, total, paid, cuota, next_date, status)
SELECT w.id, 'Refaccion de Maquinaria', 30000000, 12000000, 4520000, '2026-05-01'::DATE, 'active'
FROM wallets w WHERE w.user_id = 'USER_ID_HERE';

-- ============================================================
-- SHIFT (current)
-- ============================================================
INSERT INTO shifts (user_id, type, start_time, end_time, sector, level, day_of_rotation, total_days, date)
VALUES (
  'USER_ID_HERE', 'manana', '06:00', '14:00', 'Sector Norte', 'Nivel -3', 5, 7, '2026-04-09'
);

-- ============================================================
-- CHECK-IN (current session)
-- ============================================================
INSERT INTO check_ins (user_id, check_in_at)
VALUES ('USER_ID_HERE', '2026-04-09 05:52:00-03');

-- ============================================================
-- PAY STUB
-- ============================================================
INSERT INTO pay_stubs (user_id, period, month, year, haberes, descuentos, total_haberes, total_descuentos, neto, paid_date)
VALUES (
  'USER_ID_HERE',
  'Abril 2026', 'Abril', 2026,
  '[{"label":"Sueldo Basico","amount":52000000},{"label":"Adicional Zona Desfavorable","amount":10400000},{"label":"Horas Extra 50%","amount":4560000},{"label":"Antiguedad (7 anos)","amount":3640000},{"label":"Bono Asistencia","amount":2500000}]',
  '[{"label":"Jubilacion 11%","amount":8041000},{"label":"Obra Social 3%","amount":2193000},{"label":"Sindicato 2.5%","amount":1827500},{"label":"Adelanto de Sueldo","amount":15000000},{"label":"Cuota Microcredito","amount":4500000}]',
  73100000, 31561500, 41538500,
  '2026-04-01'
);

-- ============================================================
-- EPP ITEMS
-- ============================================================
INSERT INTO epp_items (user_id, name, status, review_date, expires_at) VALUES
  ('USER_ID_HERE', 'Casco MSA V-Gard', 'vigente', '08/2026', NULL),
  ('USER_ID_HERE', 'Botas Pampero', 'vigente', '12/2026', NULL),
  ('USER_ID_HERE', 'Proteccion Auditiva', 'por_vencer', NULL, '2026-04-20'),
  ('USER_ID_HERE', 'Arnes de Seguridad', 'vigente', '06/2026', NULL),
  ('USER_ID_HERE', 'Lentes de Proteccion', 'vencido', NULL, NULL);

-- ============================================================
-- SUPERVISOR
-- ============================================================
INSERT INTO supervisors (user_id, name, role)
VALUES ('USER_ID_HERE', 'Martinez, Roberto', 'Supervisor de Turno');

-- ============================================================
-- EMERGENCY CONTACTS
-- ============================================================
INSERT INTO emergency_contacts (user_id, name, phone, role, label) VALUES
  ('USER_ID_HERE', 'Emergencias Medicas', '107', 'medical', 'Public Utility'),
  ('USER_ID_HERE', 'Emergency Mine', '+543834567890', 'mine', 'Internal Site'),
  ('USER_ID_HERE', 'Maria (Family)', '+5491155667788', 'family', 'Primary Kin');

-- ============================================================
-- SAFETY TALK
-- ============================================================
INSERT INTO safety_talks (title, duration, date)
VALUES ('Riesgos electricos en operaciones subterraneas', '5 min', '2026-04-09');

-- ============================================================
-- SAFETY PROFILE
-- ============================================================
INSERT INTO safety_profiles (user_id, safety_score, incident_count, consecutive_talks, epp_compliance_percent, last_sos_test, completed_courses, total_courses)
VALUES ('USER_ID_HERE', 94, 0, 23, 80, '2026-03-28', 12, 15);

-- ============================================================
-- HEALTH PROFILE
-- ============================================================
INSERT INTO health_profiles (user_id, fatigue_level, readiness_score, sleep_hours, shift_load, hydration_current, hydration_goal, temperature, apto_vigente, heart_rate, steps, deep_sleep, sleep_quality, days_away_from_home, days_until_return)
VALUES ('USER_ID_HERE', 'optimo', 94, 7.75, 'Normal', 2500, 4000, 38, 'Noviembre 2026', 72, 8420, 2.1, '07:45h', 5, 2);

-- ============================================================
-- MEDICAL EXAMS
-- ============================================================
INSERT INTO medical_exams (user_id, type, date, location, status, result, preparation) VALUES
  ('USER_ID_HERE', 'Examen Periodico', '2026-05-15', 'Hospital Catamarca', 'pendiente', NULL, '["Ayuno de 12 horas","Documento de Identidad","Uniforme de Faena"]'),
  ('USER_ID_HERE', 'Audiometria', '2026-03-15', 'Hospital Catamarca', 'completado', 'Normal', '[]');

-- ============================================================
-- BENEFIT CATEGORIES
-- ============================================================
INSERT INTO benefit_categories (name, discount, color) VALUES
  ('Farmacia', '20%', '#00C48C'),
  ('Supermercado', '15%', '#00E5FF'),
  ('Optica', '10%', '#C87533'),
  ('Combustible', '5%', '#FFB020'),
  ('Indumentaria', '25%', '#6B4EFF'),
  ('Celulares', '12 cuotas', '#00E5FF'),
  ('Educacion Hijos', 'Becas $30k', '#00C48C'),
  ('Salud Familiar', 'Cobertura', '#FF3B4A');

-- ============================================================
-- FEATURED BENEFIT
-- ============================================================
INSERT INTO featured_benefits (title, description, max_amount)
VALUES ('Turismo Familiar', 'Hasta 35% en alojamientos de montana y excursiones exclusivas para trabajadores del sector.', 15000000);

-- ============================================================
-- NEARBY BUSINESSES
-- ============================================================
INSERT INTO nearby_businesses (name, category, discount, distance, has_qr) VALUES
  ('Mercado Central Industrial', 'Alimentos', '15%', '0.8 km', true),
  ('Viandas del Minero', 'Alimentos', '10%', '1.2 km', true),
  ('Gimnasio El Risco', 'Deporte', '20%', '2.1 km', false);

-- ============================================================
-- SAVINGS ENTRIES
-- ============================================================
INSERT INTO savings_entries (user_id, store, amount, category, created_at) VALUES
  ('USER_ID_HERE', 'Farmacity', 120000, 'Farmacia', '2026-04-04'::TIMESTAMPTZ),
  ('USER_ID_HERE', 'Shell Arroyo', 85000, 'Combustible', '2026-04-02'::TIMESTAMPTZ),
  ('USER_ID_HERE', 'Carrefour Express', 1052000, 'Supermercado', '2026-03-30'::TIMESTAMPTZ);

-- ============================================================
-- CAREER PROFILE
-- ============================================================
INSERT INTO career_profiles (user_id, level, next_level, xp_current, xp_required, certificates_needed, position_change)
VALUES ('USER_ID_HERE', 'Operador Senior A', 'Supervisor Junior', 2400, 3000, 2, 3);

-- ============================================================
-- CERTIFICATES
-- ============================================================
INSERT INTO certificates (user_id, name, issued_by, date, status, progress, xp_reward) VALUES
  ('USER_ID_HERE', 'Operacion de Dumper CAT 797', 'CERT-00521-2021', '2023-10-12', 'vigente', 100, 500),
  ('USER_ID_HERE', 'Induccion General de Mina', 'CERT-16291-2022', '2022-01-05', 'vigente', 100, 200),
  ('USER_ID_HERE', 'Trabajo en Altura', '', NULL, 'en_curso', 60, 400);

-- ============================================================
-- COURSES
-- ============================================================
INSERT INTO courses (name, hours, xp_reward, difficulty, type, validity) VALUES
  ('Seguridad en Excavacion Profunda', 8, 400, 'avanzado', 'obligatorio', '2 anos'),
  ('Mantenimiento Predictivo 4.0', 12, 300, 'intermedio', 'obligatorio', '1 ano'),
  ('Protocolo de Primeros Auxilios', 4, 150, 'basico', 'obligatorio', '3 anos');

-- ============================================================
-- COURSE PROGRESS (all at 0 for seed user)
-- ============================================================
INSERT INTO course_progress (user_id, course_id, progress, completed)
SELECT 'USER_ID_HERE', c.id, 0, false
FROM courses c;

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
INSERT INTO notifications (user_id, title, description, category, read, action_route, created_at) VALUES
  ('USER_ID_HERE', 'Adelanto acreditado', '$150.000 disponibles en tu cuenta', 'plata', false, '/plata', now() - INTERVAL '1 hour'),
  ('USER_ID_HERE', 'Recordatorio turno', 'Manana inicia tu descanso (7 dias)', 'turnos', false, '/turnos', now() - INTERVAL '3 hours'),
  ('USER_ID_HERE', 'Renovar proteccion auditiva', 'Vence el 20/04 — solicitar reposicion', 'seguridad', false, '/seguridad', now() - INTERVAL '5 hours'),
  ('USER_ID_HERE', 'Nuevo curso disponible', 'Operacion de Grua Puente (+500 XP)', 'turnos', true, '/carrera', now() - INTERVAL '8 hours'),
  ('USER_ID_HERE', 'Examen periodico 15/05', 'Preparacion necesaria — revisar checklist', 'salud', true, '/salud', now() - INTERVAL '1 day'),
  ('USER_ID_HERE', 'Hidratate bien', 'Llevas 5 dias consecutivos en turno', 'salud', true, NULL, now() - INTERVAL '1 day'),
  ('USER_ID_HERE', '25% dto Indumentaria', 'Nuevo descuento en Indumentaria Minera SRL', 'beneficios', true, '/beneficios', now() - INTERVAL '3 days');
