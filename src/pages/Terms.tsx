
import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import { useCart } from '@/context/CartContext';
import { useCity } from '@/context/CityContext';

const Terms = () => {
  const { cart } = useCart();
  const { currentCity } = useCity();
  
  // Fix mobile UX issue: auto-scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout cartItemCount={cart.itemCount} currentCity={currentCity}>
      <div className="container-custom py-12">
        <h1 className="text-3xl font-bold mb-8">Terms & Conditions</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">1. Overview</h2>
          <p className="text-gray-700 mb-4">
            By using Xstore, you agree to these Terms and Conditions. Xstore is a B2B platform connecting 
            suppliers with local businesses for wholesale near-expiry products and fresh produce.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">2. Account & Eligibility</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-3 ml-2">
            <li>Xstore is exclusively for business owners and their authorized representatives.</li>
            <li>Users must provide accurate business information during the ordering process.</li>
            <li>We reserve the right to verify business credentials before fulfilling orders.</li>
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">3. Order Policies</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-3 ml-2">
            <li>Minimum order value is ₹3,000 for all services.</li>
            <li>Orders must be placed at least 12 hours before expected delivery time.</li>
            <li>City selection determines product availability and cannot be changed after order placement.</li>
            <li>We reserve the right to limit order quantities based on available inventory.</li>
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">4. Payment & Pricing</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-3 ml-2">
            <li>All payments are currently collected at the time of delivery (Cash on Delivery).</li>
            <li>Prices displayed are exclusive of applicable taxes unless otherwise stated.</li>
            <li>Discounts are applied at the sole discretion of Xstore and may vary by product and city.</li>
            <li>Price changes may occur without prior notice due to market conditions, especially for Xstore Fresh products.</li>
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">5. Delivery & Fulfillment</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-3 ml-2">
            <li>Delivery is available only within the specified cities where Xstore operates.</li>
            <li>Standard delivery time is within 24 hours of order confirmation.</li>
            <li>Delivery schedules may be affected by local conditions, traffic, or other unforeseen circumstances.</li>
            <li>Someone must be present at the delivery address to receive and verify the order.</li>
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">6. Product Quality & Returns</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-3 ml-2">
            <li>All products, including near-expiry items, are guaranteed safe for consumption during their stated shelf life.</li>
            <li>Xstore Fresh products are quality-checked before dispatch.</li>
            <li>Claims for damaged or incorrect items must be made immediately upon delivery.</li>
            <li>Return/exchange requests must be made within 24 hours of delivery with photographic evidence.</li>
            <li>Returns are subject to verification and approval by the Xstore quality team.</li>
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">7. Cancellation Policy</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-3 ml-2">
            <li>Orders can be canceled free of charge up to 6 hours before the scheduled delivery time.</li>
            <li>Late cancellations may incur a 5% processing fee based on the order value.</li>
            <li>Repeated cancellations may result in restrictions on future ordering privileges.</li>
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">8. Changes to Terms</h2>
          <p className="text-gray-700 mb-4">
            Xstore reserves the right to modify these terms at any time. Changes will be effective immediately 
            upon posting on the website. Continued use of the service constitutes acceptance of the updated terms.
          </p>
          <p className="text-gray-700 mb-4">
            Last Updated: May 15, 2025
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Terms;
