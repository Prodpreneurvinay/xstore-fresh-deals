
-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT DO NOTHING;

-- Set up policy to allow public read access
CREATE POLICY "Allow public read access on products bucket" ON storage.objects
  FOR SELECT USING (bucket_id = 'products');
  
-- Allow authenticated users to upload to the bucket
CREATE POLICY "Allow authenticated users to upload to products bucket" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'products');

-- Allow users to update their uploads
CREATE POLICY "Allow users to update their uploads in products bucket" ON storage.objects
  FOR UPDATE USING (bucket_id = 'products');

-- Allow users to delete their uploads
CREATE POLICY "Allow users to delete their uploads in products bucket" ON storage.objects
  FOR DELETE USING (bucket_id = 'products');
