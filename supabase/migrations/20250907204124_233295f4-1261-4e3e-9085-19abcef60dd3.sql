-- Fix critical RLS security issues (updated)

-- 1. Fix bookings table RLS policies - drop existing first
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "System can manage bookings" ON public.bookings;

-- Replace with more restrictive policies
CREATE POLICY "Users can view their own bookings"
ON public.bookings FOR SELECT
USING (auth.uid() = client_id OR auth.uid() = freelancer_id);

CREATE POLICY "Clients can create bookings for accepted offers"
ON public.bookings FOR INSERT
WITH CHECK (
  auth.uid() = client_id AND
  EXISTS (
    SELECT 1 FROM offers 
    WHERE offers.id = offer_id 
    AND offers.status = 'accepted' 
    AND offers.client_id = auth.uid()
  )
);

CREATE POLICY "Users can update their booking details"
ON public.bookings FOR UPDATE
USING (auth.uid() = client_id OR auth.uid() = freelancer_id)
WITH CHECK (auth.uid() = client_id OR auth.uid() = freelancer_id);

-- 2. Fix payments table RLS policies  
DROP POLICY IF EXISTS "Users can view their own payments" ON public.payments;
DROP POLICY IF EXISTS "System can manage payments" ON public.payments;

-- Replace with more restrictive policies
CREATE POLICY "Users can view their own payments"
ON public.payments FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create payments for their bookings"
ON public.payments FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM bookings 
    WHERE bookings.id = booking_id 
    AND (bookings.client_id = auth.uid() OR bookings.freelancer_id = auth.uid())
  )
);

CREATE POLICY "Payment processors can update payment status"
ON public.payments FOR UPDATE
USING (auth.uid() = user_id);

-- 3. Add audit trigger for sensitive operations
CREATE OR REPLACE FUNCTION audit_sensitive_changes()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (
    resource,
    resource_id,
    action,
    user_id,
    old_data,
    new_data
  ) VALUES (
    TG_TABLE_NAME,
    COALESCE(NEW.id::text, OLD.id::text),
    TG_OP,
    auth.uid(),
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit triggers to sensitive tables
DROP TRIGGER IF EXISTS audit_offers_trigger ON public.offers;
CREATE TRIGGER audit_offers_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.offers
  FOR EACH ROW EXECUTE FUNCTION audit_sensitive_changes();

DROP TRIGGER IF EXISTS audit_payments_trigger ON public.payments;  
CREATE TRIGGER audit_payments_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION audit_sensitive_changes();