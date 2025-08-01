-- Allow public users to create orders (for public e-commerce platform)
CREATE POLICY "Allow public users to create orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

-- Allow public users to create order items (for public e-commerce platform)
CREATE POLICY "Allow public users to create order items" 
ON public.order_items 
FOR INSERT 
WITH CHECK (true);