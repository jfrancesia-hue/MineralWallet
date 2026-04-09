-- Helper functions for Edge Functions

-- Increment consecutive safety talks for a user
CREATE OR REPLACE FUNCTION increment_consecutive_talks(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE safety_profiles
  SET consecutive_talks = consecutive_talks + 1,
      updated_at = now()
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auto-create profile records when a new user profile is created
CREATE OR REPLACE FUNCTION create_user_records()
RETURNS TRIGGER AS $$
BEGIN
  -- Create wallet
  INSERT INTO wallets (user_id, cvu, alias)
  VALUES (NEW.id,
    lpad(floor(random() * 10000000000000000000000)::TEXT, 22, '0'),
    upper(replace(NEW.apellido, ' ', '') || '.' || left(NEW.nombre, 3) || '.MW')
  );

  -- Create safety profile
  INSERT INTO safety_profiles (user_id) VALUES (NEW.id);

  -- Create health profile
  INSERT INTO health_profiles (user_id) VALUES (NEW.id);

  -- Create career profile
  INSERT INTO career_profiles (user_id) VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_create_user_records
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_user_records();

-- Grant execute permissions on RPC functions
GRANT EXECUTE ON FUNCTION transfer_funds TO authenticated;
GRANT EXECUTE ON FUNCTION request_adelanto TO authenticated;
GRANT EXECUTE ON FUNCTION convert_usdt TO authenticated;
GRANT EXECUTE ON FUNCTION increment_consecutive_talks TO authenticated;
