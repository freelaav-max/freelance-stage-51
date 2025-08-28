-- Enable Row Level Security on audit_logs table
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for audit_logs table
-- Only system/admin operations should be able to view audit logs
-- For now, we'll restrict access to authenticated users who are admins
-- Note: This assumes you'll implement an admin role system in the future

-- Policy to allow viewing audit logs (for future admin functionality)
CREATE POLICY "Audit logs are restricted" 
ON public.audit_logs 
FOR SELECT 
USING (false); -- For now, completely restrict access until admin roles are implemented

-- Policy to allow system inserts (for audit logging functionality)
CREATE POLICY "System can insert audit logs" 
ON public.audit_logs 
FOR INSERT 
WITH CHECK (true); -- Allow inserts from the system

-- Policy to prevent updates and deletes (audit logs should be immutable)
CREATE POLICY "Audit logs are immutable" 
ON public.audit_logs 
FOR UPDATE 
USING (false);

CREATE POLICY "Audit logs cannot be deleted" 
ON public.audit_logs 
FOR DELETE 
USING (false);