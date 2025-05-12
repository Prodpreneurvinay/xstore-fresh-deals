
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import CartItem from '@/components/CartItem';
import { Button } from '@/components/ui/button';
import { ShoppingCart, AlertTriangle, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useCity } from '@/context/CityContext';

const MIN_ORDER_VALUE = 3000;

const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const { currentCity } = useCity();
  const navigate = useNavigate();
  
  // Check if cart meets minimum order value
  const isCartValid = cart.total >= MIN_ORDER_VALUE;
  
  // Redirect to city selection if no city is selected
  if (!currentCity) {
    navigate('/select-city');
    return null;
  }
  
  // Handle checkout
  const handleCheckout = () => {
    if (isCartValid) {
      navigate('/checkout');
    }
  };
  
  // Navigate to products page
  const handleContinueShopping = () => {
    navigate('/products');
  };
  
  return (
    <Layout cartItemCount={cart.itemCount} currentCity={currentCity}>
      <div className="container-custom py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">Your Cart</h1>
        
        {cart.items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart size={32} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add products to your cart to begin ordering</p>
            <Button onClick={handleContinueShopping} className="bg-xstore-green">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-grow">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Cart Items ({cart.itemCount})</h2>
                
                {cart.items.map((item) => (
                  <CartItem
                    key={item.product.id}
                    product={item.product}
                    quantity={item.quantity}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                  />
                ))}
              </div>
              
              <div className="mt-6">
                <Button 
                  variant="outline" 
                  onClick={handleContinueShopping}
                  className="text-xstore-green border-xstore-green hover:bg-xstore-green hover:text-white"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:w-96">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-3 border-b border-gray-100 pb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{cart.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery</span>
                    <span className="text-green-600">Free</span>
                  </div>
                </div>
                
                <div className="flex justify-between py-4 font-semibold">
                  <span>Total</span>
                  <span>₹{cart.total.toFixed(2)}</span>
                </div>
                
                {/* Minimum order value warning */}
                {!isCartValid && (
                  <div className="bg-red-50 text-red-700 p-3 rounded-md flex items-start mb-4">
                    <AlertTriangle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">
                      Minimum order value is ₹{MIN_ORDER_VALUE}. Please add ₹{(MIN_ORDER_VALUE - cart.total).toFixed(2)} more to proceed.
                    </p>
                  </div>
                )}
                
                <Button
                  onClick={handleCheckout}
                  disabled={!isCartValid}
                  className="w-full bg-xstore-green disabled:opacity-50"
                >
                  Proceed to Checkout
                  <ArrowRight size={16} className="ml-2" />
                </Button>
                
                <p className="text-xs text-gray-500 mt-4 text-center">
                  No payment required - pay on delivery
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
