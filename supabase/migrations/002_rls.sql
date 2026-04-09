-- MineralWallet Row Level Security Policies
-- Pattern: users can only access their own data
-- Shared reference tables: read-only for all authenticated users

-- ============================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE pay_stubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE epp_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE sos_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_talks ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_talk_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE benefit_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE nearby_businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE supervisors ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_benefits ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PROFILES
-- ============================================================
CREATE POLICY profiles_select ON profiles FOR SELECT TO authenticated
  USING (id = auth.uid());
CREATE POLICY profiles_update ON profiles FOR UPDATE TO authenticated
  USING (id = auth.uid());

-- ============================================================
-- WALLETS (access via user_id)
-- ============================================================
CREATE POLICY wallets_select ON wallets FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY wallets_update ON wallets FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- ============================================================
-- TRANSACTIONS (via wallet ownership)
-- ============================================================
CREATE POLICY transactions_select ON transactions FOR SELECT TO authenticated
  USING (wallet_id IN (SELECT id FROM wallets WHERE user_id = auth.uid()));
CREATE POLICY transactions_insert ON transactions FOR INSERT TO authenticated
  WITH CHECK (wallet_id IN (SELECT id FROM wallets WHERE user_id = auth.uid()));

-- ============================================================
-- FAMILY CONTACTS
-- ============================================================
CREATE POLICY family_contacts_select ON family_contacts FOR SELECT TO authenticated
  USING (wallet_id IN (SELECT id FROM wallets WHERE user_id = auth.uid()));
CREATE POLICY family_contacts_insert ON family_contacts FOR INSERT TO authenticated
  WITH CHECK (wallet_id IN (SELECT id FROM wallets WHERE user_id = auth.uid()));
CREATE POLICY family_contacts_update ON family_contacts FOR UPDATE TO authenticated
  USING (wallet_id IN (SELECT id FROM wallets WHERE user_id = auth.uid()));
CREATE POLICY family_contacts_delete ON family_contacts FOR DELETE TO authenticated
  USING (wallet_id IN (SELECT id FROM wallets WHERE user_id = auth.uid()));

-- ============================================================
-- LOANS
-- ============================================================
CREATE POLICY loans_select ON loans FOR SELECT TO authenticated
  USING (wallet_id IN (SELECT id FROM wallets WHERE user_id = auth.uid()));

-- ============================================================
-- SHIFTS
-- ============================================================
CREATE POLICY shifts_select ON shifts FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- ============================================================
-- CHECK-INS
-- ============================================================
CREATE POLICY check_ins_select ON check_ins FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY check_ins_insert ON check_ins FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY check_ins_update ON check_ins FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- ============================================================
-- PAY STUBS
-- ============================================================
CREATE POLICY pay_stubs_select ON pay_stubs FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- ============================================================
-- EPP ITEMS
-- ============================================================
CREATE POLICY epp_items_select ON epp_items FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- ============================================================
-- SOS EVENTS
-- ============================================================
CREATE POLICY sos_events_select ON sos_events FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY sos_events_insert ON sos_events FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY sos_events_update ON sos_events FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- ============================================================
-- EMERGENCY CONTACTS
-- ============================================================
CREATE POLICY emergency_contacts_select ON emergency_contacts FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY emergency_contacts_insert ON emergency_contacts FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY emergency_contacts_update ON emergency_contacts FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- ============================================================
-- SAFETY TALKS (shared, read-only for all authenticated)
-- ============================================================
CREATE POLICY safety_talks_select ON safety_talks FOR SELECT TO authenticated
  USING (true);

-- ============================================================
-- SAFETY TALK COMPLETIONS
-- ============================================================
CREATE POLICY safety_talk_completions_select ON safety_talk_completions FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY safety_talk_completions_insert ON safety_talk_completions FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- ============================================================
-- SAFETY PROFILES
-- ============================================================
CREATE POLICY safety_profiles_select ON safety_profiles FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- ============================================================
-- HEALTH LOGS
-- ============================================================
CREATE POLICY health_logs_select ON health_logs FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY health_logs_insert ON health_logs FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- ============================================================
-- HEALTH PROFILES
-- ============================================================
CREATE POLICY health_profiles_select ON health_profiles FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY health_profiles_update ON health_profiles FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- ============================================================
-- MEDICAL EXAMS
-- ============================================================
CREATE POLICY medical_exams_select ON medical_exams FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- ============================================================
-- BENEFIT CATEGORIES (shared, read-only)
-- ============================================================
CREATE POLICY benefit_categories_select ON benefit_categories FOR SELECT TO authenticated
  USING (true);

-- ============================================================
-- NEARBY BUSINESSES (shared, read-only)
-- ============================================================
CREATE POLICY nearby_businesses_select ON nearby_businesses FOR SELECT TO authenticated
  USING (true);

-- ============================================================
-- SAVINGS ENTRIES
-- ============================================================
CREATE POLICY savings_entries_select ON savings_entries FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY savings_entries_insert ON savings_entries FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- ============================================================
-- CAREER PROFILES
-- ============================================================
CREATE POLICY career_profiles_select ON career_profiles FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- ============================================================
-- CERTIFICATES
-- ============================================================
CREATE POLICY certificates_select ON certificates FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- ============================================================
-- COURSES (shared, read-only)
-- ============================================================
CREATE POLICY courses_select ON courses FOR SELECT TO authenticated
  USING (true);

-- ============================================================
-- COURSE PROGRESS
-- ============================================================
CREATE POLICY course_progress_select ON course_progress FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY course_progress_insert ON course_progress FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY course_progress_update ON course_progress FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE POLICY notifications_select ON notifications FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY notifications_update ON notifications FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- ============================================================
-- PUSH TOKENS
-- ============================================================
CREATE POLICY push_tokens_select ON push_tokens FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY push_tokens_insert ON push_tokens FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY push_tokens_delete ON push_tokens FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- ============================================================
-- SUPERVISORS
-- ============================================================
CREATE POLICY supervisors_select ON supervisors FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- ============================================================
-- FEATURED BENEFITS (shared, read-only)
-- ============================================================
CREATE POLICY featured_benefits_select ON featured_benefits FOR SELECT TO authenticated
  USING (active = true);
