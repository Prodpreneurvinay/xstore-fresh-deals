-- Let's test a complete order creation workflow to identify the exact issue
DO $$
DECLARE
    test_order_id uuid;
    test_product_id uuid := '02019219-acc4-4f17-9230-5234e0235862'; -- Using existing product from earlier query
BEGIN
    RAISE NOTICE 'Starting order creation test...';
    
    -- Step 1: Insert order
    INSERT INTO public.orders (shop_name, phone_number, address, city, total, status, landmark)
    VALUES ('Test Shop Debug', '9999999999', 'Test Address Debug', 'Haridwar', 150.50, 'pending', 'Test Landmark')
    RETURNING id INTO test_order_id;
    
    RAISE NOTICE 'Order created with ID: %', test_order_id;
    
    -- Step 2: Insert order item
    INSERT INTO public.order_items (order_id, product_id, quantity, price, product_name, product_image, product_category)
    VALUES (test_order_id, test_product_id, 2, 75.25, 'Test Product Debug', 'test-image.jpg', 'Test Category');
    
    RAISE NOTICE 'Order item created successfully';
    
    -- Step 3: Verify the complete order
    PERFORM FROM public.orders o 
    JOIN public.order_items oi ON o.id = oi.order_id 
    WHERE o.id = test_order_id;
    
    RAISE NOTICE 'Order verification successful';
    
    -- Clean up
    DELETE FROM public.order_items WHERE order_id = test_order_id;
    DELETE FROM public.orders WHERE id = test_order_id;
    
    RAISE NOTICE 'Order creation test completed successfully';
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Order creation test failed with error: %', SQLERRM;
        -- Clean up on error
        BEGIN
            DELETE FROM public.order_items WHERE order_id = test_order_id;
            DELETE FROM public.orders WHERE id = test_order_id;
        EXCEPTION
            WHEN OTHERS THEN
                -- Ignore cleanup errors
                NULL;
        END;
END $$;