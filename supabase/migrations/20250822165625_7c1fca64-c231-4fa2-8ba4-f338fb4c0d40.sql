
-- Add whatsapp_notification_opt_in column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN whatsapp_notification_opt_in BOOLEAN DEFAULT false;

-- Update the column to be NOT NULL with a default value
ALTER TABLE public.profiles 
ALTER COLUMN whatsapp_notification_opt_in SET NOT NULL;

-- Add a comment to document the field
COMMENT ON COLUMN public.profiles.whatsapp_notification_opt_in IS 'Indicates if user has opted in to receive WhatsApp notifications';
