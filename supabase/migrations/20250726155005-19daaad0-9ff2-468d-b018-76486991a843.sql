-- Enable Row Level Security on orders and order_items tables
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create admin_users table for secure admin management
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.admin_users 
    WHERE admin_users.user_id = is_admin.user_id
  );
$$;

-- Create RLS policies for orders table
CREATE POLICY "Admins can manage all orders" 
ON public.orders 
FOR ALL 
USING (public.is_admin());

-- Create RLS policies for order_items table  
CREATE POLICY "Admins can manage all order items"
ON public.order_items
FOR ALL
USING (public.is_admin());

-- Create RLS policies for admin_users table
CREATE POLICY "Admins can view all admin users"
ON public.admin_users
FOR SELECT
USING (public.is_admin());

CREATE POLICY "Admins can manage admin users"
ON public.admin_users
FOR ALL
USING (public.is_admin());

-- Remove overly permissive policies from products, cities, and product_cities
DROP POLICY IF EXISTS "Allow all operations from admin" ON public.products;
DROP POLICY IF EXISTS "Allow all operations on cities from admin" ON public.cities;
DROP POLICY IF EXISTS "Allow all operations on product_cities from admin" ON public.product_cities;

-- Create secure admin policies for products
CREATE POLICY "Admins can manage products"
ON public.products
FOR ALL
USING (public.is_admin());

-- Create secure admin policies for cities
CREATE POLICY "Admins can manage cities"
ON public.cities
FOR ALL
USING (public.is_admin());

-- Create secure admin policies for product_cities
CREATE POLICY "Admins can manage product_cities"
ON public.product_cities
FOR ALL
USING (public.is_admin());

-- Create trigger for updated_at on admin_users
CREATE TRIGGER update_admin_users_updated_at
BEFORE UPDATE ON public.admin_users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();