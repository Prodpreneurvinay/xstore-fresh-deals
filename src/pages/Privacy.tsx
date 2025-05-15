
import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import { useCart } from '@/context/CartContext';
import { useCity } from '@/context/CityContext';

const Privacy = () => {
  const { cart } = useCart();
  const { currentCity } = useCity();
  
  // Fix mobile UX issue: auto-scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout cartItemCount={cart.itemCount} currentCity={currentCity}>
      <div className="container-custom py-12">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">1. Information We Collect</h2>
          <p className="text-gray-700 mb-4">
            At Xstore, we value your privacy and are committed to protecting your personal information. 
            We collect only the data necessary to fulfill your orders and provide our services:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-3 ml-2">
            <li>Business name and contact person</li>
            <li>Phone number for order communication</li>
            <li>Delivery address</li>
            <li>City location for inventory management</li>
            <li>Order history and preferences</li>
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">2. How We Use Your Information</h2>
          <p className="text-gray-700 mb-4">
            Your information is used exclusively for:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-3 ml-2">
            <li>Processing and fulfilling your orders</li>
            <li>Communicating about delivery status and timing</li>
            <li>Contacting you regarding your order queries</li>
            <li>Improving our service based on feedback and order patterns</li>
            <li>Sending relevant updates about inventory in your city (when you opt in)</li>
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">3. Data Protection</h2>
          <p className="text-gray-700 mb-4">
            We implement appropriate security measures to protect your personal information:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-3 ml-2">
            <li>All data is stored securely with industry-standard encryption</li>
            <li>Access to customer data is strictly limited to essential personnel</li>
            <li>Regular security audits are conducted to ensure data protection</li>
            <li>We do not store payment information as all transactions are cash-on-delivery</li>
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">4. Third-Party Sharing</h2>
          <p className="text-gray-700 mb-4">
            We do not sell, trade, or transfer your personally identifiable information to outside parties. 
            This does not include trusted third parties who assist us in operating our business, such as:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-3 ml-2">
            <li>Delivery partners who need address information to fulfill orders</li>
            <li>Tech providers who help maintain our platform (with strict data protection agreements)</li>
          </ul>
          <p className="text-gray-700 mt-4">
            These parties agree to keep this information confidential and use it only for the specified purpose.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">5. Your Rights</h2>
          <p className="text-gray-700 mb-4">
            You have the right to:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-3 ml-2">
            <li>Request access to your personal data</li>
            <li>Correct any inaccurate information</li>
            <li>Request deletion of your data (where applicable)</li>
            <li>Opt out of communications</li>
            <li>Raise concerns about our data practices</li>
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">6. Contact Us</h2>
          <p className="text-gray-700 mb-4">
            If you have any questions or concerns about this Privacy Policy, please contact us at:
          </p>
          <p className="text-gray-700">
            <strong>Email:</strong> privacy@xstore.com<br />
            <strong>Phone:</strong> +91 98765 43210
          </p>
          <p className="text-gray-700 mt-4">
            Last Updated: May 15, 2025
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;
