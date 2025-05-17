import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import { useCart } from '@/context/CartContext';
import { useCity } from '@/context/CityContext';
const AboutUs = () => {
  const {
    cart
  } = useCart();
  const {
    currentCity
  } = useCity();

  // Fix mobile UX issue: auto-scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return <Layout cartItemCount={cart.itemCount} currentCity={currentCity}>
      <div className="container-custom py-12">
        <h1 className="text-3xl font-bold mb-8">About Xstore</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-xstore-green">Our Mission</h2>
            <p className="text-gray-700 mb-4">
              Xstore aims to revolutionize B2B wholesale by offering near-expiry products at steep discounts, 
              creating a win-win for suppliers and local businesses while reducing food waste.
            </p>
            <p className="text-gray-700 mb-4">
              We connect suppliers with excess inventory to local retailers, saving perfectly good products 
              from ending up in landfills while helping small businesses increase their profit margins.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img src="/lovable-uploads/d8cd9b69-9c4a-469c-989a-a1a74f341829.jpg" alt="Xstore Retail Products" className="w-full h-64 object-cover" />
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-xstore-green">How Xstore Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-xstore-green-light rounded-full flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-xstore-green">1</span>
              </div>
              <h3 className="text-lg font-medium mb-3">We Source Products</h3>
              <p className="text-gray-600">
                We partner with major FMCG companies and retailers to source quality 
                products that are nearing their best-before date or have excess inventory.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-xstore-green-light rounded-full flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-xstore-green">2</span>
              </div>
              <h3 className="text-lg font-medium mb-3">City-Based Inventory</h3>
              <p className="text-gray-600">
                We maintain separate inventories for each city we operate in, 
                ensuring fast delivery and reduced logistics costs.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-xstore-green-light rounded-full flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-xstore-green">3</span>
              </div>
              <h3 className="text-lg font-medium mb-3">B2B Distribution</h3>
              <p className="text-gray-600">
                We distribute these products to local retailers, hotels, and institutions 
                at significantly discounted prices, sometimes up to 90% off MRP.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-8 rounded-lg mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center text-xstore-green">Our Impact</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-4xl font-bold text-xstore-green mb-2">₹21 Lakh+</p>
              <p className="text-gray-600">Worth of food saved last month</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-xstore-green mb-2">300+</p>
              <p className="text-gray-600">Local businesses benefited</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-xstore-green mb-2">5</p>
              <p className="text-gray-600">Cities and growing</p>
            </div>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-xstore-green">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-medium mb-3 text-xstore-orange">Xstore Retail</h3>
              <p className="text-gray-600 mb-4">
                Our wholesale platform for products close to expiry with discounts up to 90%. 
                Perfect for small retailers, hotels, and institutions looking to maximize profits.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                <li>FMCG products at deep discounts</li>
                <li>Quality assured, safe for consumption</li>
                <li>Minimum order value ₹3,000</li>
                <li>Delivery within 24 hours</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-medium mb-3 text-xstore-green">Xstore Fresh</h3>
              <p className="text-gray-600 mb-4">
                Fresh fruits and vegetables sourced directly from the mandi, delivered within 24 hours. 
                Focusing on B2B partners like hotels, restaurants, and local shops.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                <li>Farm-fresh produce at competitive prices</li>
                <li>Carefully sorted and quality checked</li>
                <li>Available daily for timely delivery</li>
                <li>Customize your order sizes</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-xstore-green">Customer Testimonials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="italic border-l-4 border-xstore-green pl-4 py-2">
              "Xstore has revolutionized our inventory management. Their near-expiry products have 
              excellent demand in my shop, and the margins are unbeatable."
              <p className="mt-2 font-semibold">- Rajesh Kumar, Grocery Store Owner</p>
            </div>
            
            <div className="italic border-l-4 border-xstore-green pl-4 py-2">
              "We've been using Xstore Fresh for our restaurant supplies. The quality is consistently 
              good, and their 24-hour delivery commitment has never failed."
              <p className="mt-2 font-semibold">- Priya Singh, Restaurant Manager</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>;
};
export default AboutUs;