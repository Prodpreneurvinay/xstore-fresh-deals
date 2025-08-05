-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can manage admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can view all admin users" ON public.admin_users;

-- Create a new policy that allows the first admin to be created
-- and then requires admin privileges for subsequent operations
CREATE POLICY "Allow initial admin creation and admin management" 
ON public.admin_users 
FOR ALL 
USING (
  -- Allow if user is already an admin OR if no admins exist yet (bootstrap case)
  is_admin() OR NOT EXISTS(SELECT 1 FROM public.admin_users LIMIT 1)
)
WITH CHECK (
  -- Same condition for inserts/updates
  is_admin() OR NOT EXISTS(SELECT 1 FROM public.admin_users LIMIT 1)
);

-- Create a function to safely create the first admin user
CREATE OR REPLACE FUNCTION public.create_first_admin(target_email text, target_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only allow if no admin users exist
  IF EXISTS(SELECT 1 FROM public.admin_users LIMIT 1) THEN
    RAISE EXCEPTION 'Admin users already exist. Use promote_user_to_admin instead.';
  END IF;
  
  -- Insert the first admin user
  INSERT INTO public.admin_users (user_id, email, role)
  VALUES (target_user_id, target_email, 'admin');
  
  RETURN true;
END;
$$;