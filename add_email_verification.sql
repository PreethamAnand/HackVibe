-- Add email verification columns to existing registrations table
-- Run this script in your Supabase SQL editor

-- Add verification columns
ALTER TABLE public.registrations 
ADD COLUMN IF NOT EXISTS email_verified boolean DEFAULT false;

ALTER TABLE public.registrations 
ADD COLUMN IF NOT EXISTS verification_token text;

ALTER TABLE public.registrations 
ADD COLUMN IF NOT EXISTS verification_expires_at timestamptz;

-- Create index for verification token
CREATE INDEX IF NOT EXISTS idx_registrations_verification_token 
ON public.registrations(verification_token);

-- Add comment to columns
COMMENT ON COLUMN public.registrations.email_verified IS 'Whether the email has been verified';
COMMENT ON COLUMN public.registrations.verification_token IS 'Unique token for email verification';
COMMENT ON COLUMN public.registrations.verification_expires_at IS 'When the verification token expires';

-- Update existing registrations to mark them as verified (if you want to grandfather existing registrations)
-- UPDATE public.registrations SET email_verified = true WHERE email_verified IS NULL; 