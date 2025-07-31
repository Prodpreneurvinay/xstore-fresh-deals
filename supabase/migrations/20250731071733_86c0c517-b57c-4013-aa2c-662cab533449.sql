-- Create the first admin user
-- First, we need to insert a user into auth.users (this would normally be done through signup)
-- But since we're doing it manually, we'll create an admin_users entry that can be linked later

-- Insert admin user record
INSERT INTO public.admin_users (user_id, email, role) 
VALUES (
  gen_random_uuid(), -- This will be replaced when actual auth user is created
  'admin@xstoreindia.shop',
  'admin'
);

-- Add landmark field to orders table for new requirement
ALTER TABLE public.orders ADD COLUMN landmark text;

-- Create a function to get nearby shops that recently bought products
CREATE OR REPLACE FUNCTION public.get_nearby_shops_for_products(
  user_city text,
  product_ids uuid[],
  days_back integer DEFAULT 7
)
RETURNS TABLE (
  product_id uuid,
  product_name text,
  shop_name text,
  shop_address text,
  shop_city text,
  landmark text,
  order_date timestamp with time zone
)
LANGUAGE sql
STABLE
AS $$
  SELECT DISTINCT
    oi.product_id,
    oi.product_name,
    o.shop_name,
    o.address as shop_address,
    o.city as shop_city,
    o.landmark,
    o.created_at as order_date
  FROM public.orders o
  JOIN public.order_items oi ON o.id = oi.order_id
  WHERE 
    o.city = user_city
    AND oi.product_id = ANY(product_ids)
    AND o.created_at >= NOW() - INTERVAL '1 day' * days_back
    AND o.status IN ('pending', 'confirmed', 'delivered')
  ORDER BY o.created_at DESC;
$$;