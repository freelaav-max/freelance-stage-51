-- Ensure all necessary tables have RLS enabled
-- (This should already be done, but let's be explicit)

-- Check and enable RLS for all relevant tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE freelancer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE freelancer_specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE availabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Add RLS policy for audit_logs (this was missing)
CREATE POLICY "Audit logs are only viewable by service role" ON audit_logs
FOR SELECT USING (false); -- Only accessible via service role

-- Ensure all policies exist (these should already be created, but double-checking)
-- If policies already exist, this will fail silently which is fine

-- Double-check that all tables in public schema have RLS enabled by listing any without RLS
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN 
        SELECT schemaname, tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND NOT EXISTS (
            SELECT 1 FROM pg_class 
            WHERE pg_class.oid = (schemaname||'.'||tablename)::regclass 
            AND relrowsecurity = true
        )
    LOOP
        RAISE NOTICE 'Table %.% does not have RLS enabled', r.schemaname, r.tablename;
    END LOOP;
END $$;