-- Fix the security issues step by step
-- Re-enable RLS on orders and order_items tables
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create secure RLS policies for orders
-- Allow anyone to insert new orders (for e-commerce checkout)
CREATE POLICY "Allow public order creation" 
ON public.orders 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Allow admins to view and manage all orders
CREATE POLICY "Admins can manage all orders" 
ON public.orders 
FOR ALL
TO authenticated
USING (is_admin());

-- Create secure RLS policies for order_items  
-- Allow anyone to insert order items (for e-commerce checkout)
CREATE POLICY "Allow public order item creation" 
ON public.order_items 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Allow admins to view and manage all order items
CREATE POLICY "Admins can manage all order items" 
ON public.order_items 
FOR ALL
TO authenticated
USING (is_admin());

-- Create a function to safely promote users to admin (only existing admins can promote)
CREATE OR REPLACE FUNCTION public.promote_user_to_admin(target_email text, target_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if current user is admin (or if this is the first admin setup)
  IF NOT is_admin() AND EXISTS(SELECT 1 FROM public.admin_users LIMIT 1) THEN
    RAISE EXCEPTION 'Only admins can promote users to admin';
  END IF;
  
  -- Insert the new admin user
  INSERT INTO public.admin_users (user_id, email, role)
  VALUES (target_user_id, target_email, 'admin')
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN true;
END;
$$;