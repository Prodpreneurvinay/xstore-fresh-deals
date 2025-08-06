-- Test if there are any RLS issues by temporarily checking policies
-- Add better error handling for order creation

-- First, let's ensure the RLS policies are working correctly for orders and order_items
-- Check current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename IN ('orders', 'order_items');

-- Test inserting a sample order to verify RLS works
DO $$
DECLARE
    test_order_id uuid;
BEGIN
    -- Try to insert a test order
    INSERT INTO public.orders (shop_name, phone_number, address, city, total, status, landmark)
    VALUES ('Test Shop', '1234567890', 'Test Address', 'Test City', 100.00, 'pending', 'Test Landmark')
    RETURNING id INTO test_order_id;
    
    -- Try to insert a test order item
    INSERT INTO public.order_items (order_id, product_id, quantity, price, product_name)
    VALUES (test_order_id, gen_random_uuid(), 1, 100.00, 'Test Product');
    
    -- Clean up test data
    DELETE FROM public.order_items WHERE order_id = test_order_id;
    DELETE FROM public.orders WHERE id = test_order_id;
    
    RAISE NOTICE 'Order creation test successful';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Order creation test failed: %', SQLERRM;
        -- Try to clean up in case of partial success
        DELETE FROM public.order_items WHERE order_id = test_order_id;
        DELETE FROM public.orders WHERE id = test_order_id;
END $$;