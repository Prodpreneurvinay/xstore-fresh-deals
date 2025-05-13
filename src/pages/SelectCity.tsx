
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from "@/components/Layout";
import { useCity } from '@/context/CityContext';
import { MapPin, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SelectCity = () => {
  const { setCity, availableCities, isLoading } = useCity();
  const navigate = useNavigate();

  const handleCitySelect = (city: string) => {
    setCity(city);
    navigate('/');
  };

  return (
    <Layout>
      <div className="max-w-lg mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-6 text-center">Select Your City</h1>
        
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
