-- First, drop all existing policies on orders and order_items tables to start fresh
DROP POLICY IF EXISTS "Admins can manage all orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public users to create orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can manage all order items" ON public.order_items;
DROP POLICY IF EXISTS "Allow public users to create order items" ON public.order_items;

-- Create simplified policies for public e-commerce platform
-- Allow anyone to create orders (no authentication required for public ordering)
CREATE POLICY "Public can create orders" 
ON public.orders 
FOR INSERT 
TO public
WITH CHECK (true);

-- Allow anyone to create order items (no authentication required for public ordering)
CREATE POLICY "Public can create order items" 
ON public.order_items 
FOR INSERT 
TO public
WITH CHECK (true);

-- Allow admins to manage everything
CREATE POLICY "Admins can manage orders" 
ON public.orders 
FOR ALL 
TO public
USING (is_admin());

-- Allow admins to manage order items  
CREATE POLICY "Admins can manage order items" 
ON public.order_items 
FOR ALL 
TO public
USING (is_admin());