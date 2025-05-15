
import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ShoppingBag, Salad, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useCity } from '@/context/CityContext';

const Index = () => {
  const { cart } = useCart();
  const { currentCity } = useCity();
  
  // Fix mobile UX issue: auto-scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout cartItemCount={cart.itemCount} currentCity={currentCity}>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-xstore-green-light to-xstore-green py-16 text-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">
            <div className="order-2 md:order-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Save Big on Near-Expiry Stock — Up to 95% OFF for Local Shopkeepers!</h1>
              <p className="text-lg md:text-xl mb-8">
                From discounted near-expiry products to fresh daily produce, we've got your business covered.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-white text-xstore-green hover:bg-gray-100 border-2 border-white shadow-lg">
                  <Link to="/products">Browse Products</Link>
                </Button>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <img alt="Xstore products" className="w-full h-auto rounded-xl shadow-lg" src="/lovable-uploads/d7a4a44d-5671-4af7-95b6-3c28f13a611b.png" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Xstore Retail */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-transform hover:-translate-y-1 hover:shadow-lg">
              <div className="aspect-video overflow-hidden">
                <img alt="Xstore Retail" className="w-full h-full object-cover" src="/lovable-uploads/d8cd9b69-9c4a-469c-989a-a1a74f341829.jpg" />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <ShoppingBag className="text-xstore-orange mr-2" size={24} />
                  <h3 className="text-2xl font-semibold">Xstore Retail</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Get near-expiry FMCG products from large chains at discounted rates. 
                  Perfect for retail shopkeepers looking to maximize profits.
                </p>
                <div className="flex items-center">
                  <Button asChild className="bg-xstore-orange hover:bg-xstore-orange-dark shadow-md">
                    <Link to="/select-city">
                      Explore Products
                      <ArrowRight size={16} className="ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Xstore Fresh */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-transform hover:-translate-y-1 hover:shadow-lg">
              <div className="aspect-video overflow-hidden">
                <img alt="Xstore Fresh" className="w-full h-full object-cover" src="/lovable-uploads/678ffc9b-ba7c-4065-990e-bf864cbeaceb.jpg" />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <Salad className="text-xstore-green mr-2" size={24} />
                  <h3 className="text-2xl font-semibold">Xstore Fresh</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Daily delivery of fresh fruits, vegetables, and frozen goods sourced from local mandis. 
                  Ideal for restaurants and hotels.
                </p>
                <div className="flex items-center">
                  <Button asChild className="shadow-md">
                    <Link to="/select-city">
                      Fresh Produce
                      <ArrowRight size={16} className="ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            We've made the ordering process simple and frictionless for your business
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-xstore-green rounded-full text-white flex items-center justify-center mb-4">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Select Your City</h3>
              <p className="text-gray-600">
                Choose your city to see available products in your area. We're currently available in select major cities.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-xstore-green rounded-full text-white flex items-center justify-center mb-4">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Add Products to Cart</h3>
              <p className="text-gray-600">
                Browse our extensive catalog and add products to your cart. Minimum order value is ₹3,000.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-xstore-green rounded-full text-white flex items-center justify-center mb-4">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Complete Your Order</h3>
              <p className="text-gray-600">
                Provide your shop details and delivery address. No payment needed - we'll deliver and collect on delivery.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-xstore-orange to-xstore-orange-light text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join hundreds of businesses already using Xstore to optimize their supply chain
          </p>
          <Button asChild size="lg" className="bg-white text-xstore-orange hover:bg-gray-100 shadow-lg">
            <Link to="/select-city">Select Your City</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
