
import React from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Layout from "@/components/Layout";
import { useCity } from '@/context/CityContext';
import { MapPin, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const SelectCity = () => {
  const { setCity, availableCities, isLoading } = useCity();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const serviceType = searchParams.get('service'); // 'fresh' or 'retail'

  const handleCitySelect = (city: string) => {
    setCity(city);
    
    // Determine where to redirect based on service type
    const redirectPath = serviceType === 'fresh' ? '/xstore-fresh' : '/products';
    const serviceName = serviceType === 'fresh' ? 'Xstore Fresh' : 'Xstore Retail';
    
    toast({
      title: "City Selected",
      description: `You've selected ${city}. Showing ${serviceName} products available in your area.`
    });
    
    navigate(redirectPath);
  };

  const getPageTitle = () => {
    if (serviceType === 'fresh') {
      return 'Select Your City for Fresh Produce';
    }
    return 'Select Your City';
  };

  const getPageDescription = () => {
    if (serviceType === 'fresh') {
      return 'Choose your city to see fresh fruits, vegetables, and daily produce available for delivery.';
    }
    return 'Choose your city to see products available in your area.';
  };

  return (
    <Layout>
      <div className="max-w-lg mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-2 text-center">{getPageTitle()}</h1>
        <p className="text-gray-600 text-center mb-6">{getPageDescription()}</p>
        
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-xstore-green" />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <ul className="divide-y divide-gray-100">
              {availableCities.map((city) => (
                <li key={city}>
                  <Button
                    variant="ghost"
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                    onClick={() => handleCitySelect(city)}
                  >
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-xstore-green mr-3" />
                      <span>{city}</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {availableCities.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <p className="text-gray-500">No cities available at the moment.</p>
            <Link to="/" className="text-xstore-green hover:underline mt-2 inline-block">
              Go back to homepage
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SelectCity;
