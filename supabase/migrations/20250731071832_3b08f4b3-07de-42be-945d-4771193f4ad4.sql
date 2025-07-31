-- Fix security warning: Set search_path for the function
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
SECURITY DEFINER
SET search_path = public
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