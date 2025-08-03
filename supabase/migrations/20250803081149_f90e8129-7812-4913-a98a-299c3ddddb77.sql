-- Create table to store OTPs for admin verification
CREATE TABLE public.admin_otps (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL, -- The email someone is trying to make admin
  otp_code text NOT NULL,
  expires_at timestamp with time zone NOT NULL,
  verified boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on admin_otps table
ALTER TABLE public.admin_otps ENABLE ROW LEVEL SECURITY;

-- Allow public access to insert and select OTPs (needed for verification flow)
CREATE POLICY "Allow public OTP operations" 
ON public.admin_otps 
FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Create index for better performance on OTP lookups
CREATE INDEX idx_admin_otps_otp_code ON public.admin_otps(otp_code);
CREATE INDEX idx_admin_otps_email ON public.admin_otps(email);

-- Function to clean up expired OTPs
CREATE OR REPLACE FUNCTION public.cleanup_expired_otps()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.admin_otps 
  WHERE expires_at < now() OR verified = true;
END;
$$;