
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { useCity, AVAILABLE_CITIES } from '@/context/CityContext';
import { useCart } from '@/context/CartContext';

const SelectCity = () => {
  const { setCity } = useCity();
  const { cart } = useCart();
  const navigate = useNavigate();
  
  const handleCitySelect = (city: string) => {
    setCity(city);
    navigate('/products');
  };
  
  return (
    <Layout cartItemCount={cart.itemCount} hideFooter>
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-lg p-6 md:p-8 bg-white rounded-xl shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Select Your City</h1>
            <p className="text-gray-600">
              We're currently available in the following cities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {AVAILABLE_CITIES.map((city) => (
              <Button
                key={city}
                variant="outline"
                className="flex items-center justify-center h-12 text-lg hover:bg-xstore-green hover:text-white border-2"
                onClick={() => handleCitySelect(city)}
              >
                <MapPin size={16} className="mr-2" />
                {city}
              </Button>
            ))}
          </div>
          
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Don't see your city? We're expanding soon!</p>
            <p>Contact us at <a href="mailto:support@xstore.com" className="text-xstore-green">support@xstore.com</a> for updates.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SelectCity;
