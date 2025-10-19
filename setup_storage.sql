-- Setup Supabase Storage for payment screenshots

-- Create storage bucket for payment screenshots
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'payment-screenshots', 
  'payment-screenshots', 
  true, 
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for payment-screenshots bucket

-- Allow anon users to upload (insert) files to the 'payment-screenshots' bucket
DROP POLICY IF EXISTS "Allow anon upload payment screenshots" ON storage.objects;
CREATE POLICY "Allow anon upload payment screenshots" ON storage.objects
FOR INSERT TO anon
WITH CHECK (bucket_id = 'payment-screenshots');

-- Allow anon users to view (select) files from the 'payment-screenshots' bucket
DROP POLICY IF EXISTS "Allow anon read payment screenshots" ON storage.objects;
CREATE POLICY "Allow anon read payment screenshots" ON storage.objects
FOR SELECT TO anon
USING (bucket_id = 'payment-screenshots');

-- Allow authenticated users to upload (insert) files to the 'payment-screenshots' bucket
DROP POLICY IF EXISTS "Allow authenticated upload payment screenshots" ON storage.objects;
CREATE POLICY "Allow authenticated upload payment screenshots" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'payment-screenshots');

-- Allow authenticated users to view (select) files from the 'payment-screenshots' bucket
DROP POLICY IF EXISTS "Allow authenticated read payment screenshots" ON storage.objects;
CREATE POLICY "Allow authenticated read payment screenshots" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'payment-screenshots');

-- Optional: Allow users to update their own files (if needed)
DROP POLICY IF EXISTS "Allow update payment screenshots" ON storage.objects;
CREATE POLICY "Allow update payment screenshots" ON storage.objects
FOR UPDATE TO anon
USING (bucket_id = 'payment-screenshots')
WITH CHECK (bucket_id = 'payment-screenshots');

-- Optional: Allow users to delete their own files (if needed)
DROP POLICY IF EXISTS "Allow delete payment screenshots" ON storage.objects;
CREATE POLICY "Allow delete payment screenshots" ON storage.objects
FOR DELETE TO anon
USING (bucket_id = 'payment-screenshots');
