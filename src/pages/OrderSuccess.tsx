
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Check, ShoppingBag } from 'lucide-react';
import { useCity } from '@/context/CityContext';

const OrderSuccess = () => {
  const { currentCity } = useCity();
  
  return (
    <Layout currentCity={currentCity}>
      <div className="container-custom py-16">
        <div className="max-w-lg mx-auto text-center">
          <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
            <Check size={48} className="text-xstore-green" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for your order. We've received your order and will contact you shortly to confirm the delivery details.
          </p>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag size={18} className="text-xstore-green" />
              <h3 className="text-lg font-semibold">Order Information</h3>
            </div>
            <div className="text-left space-y-2">
              <p><span className="text-gray-500">Estimated Delivery:</span> Within 24 hours</p>
              <p><span className="text-gray-500">Payment Mode:</span> Cash on Delivery</p>
              <p className="text-sm text-gray-500 pt-2">
                Our team will contact you on your provided phone number to confirm the order and delivery time.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-xstore-green">
              <Link to="/products">Continue Shopping</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderSuccess;
