
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { MapPin, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useCity } from '@/context/CityContext';

const SelectCity = () => {
  const navigate = useNavigate();
  const { setCity, availableCities, isLoading } = useCity();

  const handleCitySelect = (city: string) => {
    setCity(city);
    navigate('/');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8">Select Your City</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-xstore-green" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {availableCities.map((city) => (
              <Card 
                key={city} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleCitySelect(city)}
              >
                <CardContent className="flex items-center justify-center p-6">
                  <div className="flex flex-col items-center">
                    <MapPin className="h-8 w-8 text-xstore-green mb-2" />
                    <span className="text-lg font-semibold">{city}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {availableCities.length === 0 && (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-500">No cities available at the moment. Please check back later.</p>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="text-gray-600"
          >
            Continue to Homepage
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default SelectCity;
