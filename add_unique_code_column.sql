-- Add unique_code column to existing registrations table
-- Run this script if you already have a database with the old schema

-- Add the unique_code column
ALTER TABLE public.registrations 
ADD COLUMN IF NOT EXISTS unique_code text;

-- Create unique index for unique_code
CREATE UNIQUE INDEX IF NOT EXISTS uq_registrations_unique_code 
ON public.registrations(unique_code);

-- Add a comment to the column
COMMENT ON COLUMN public.registrations.unique_code IS 'Unique 6-digit registration code for each team'; 