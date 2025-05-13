
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { getCities } from '@/services/cityService';

type CityContextType = {
  city: string | null;
  currentCity: string | null; // Added for backward compatibility
  setCity: (city: string) => void;
  availableCities: string[];
  isLoading: boolean;
};

const CityContext = createContext<CityContextType>({
  city: null,
  currentCity: null, // Added for backward compatibility
  setCity: () => {},
  availableCities: [],
  isLoading: false,
});

export const useCity = () => useContext(CityContext);

export const CityProvider = ({ children }: { children: React.ReactNode }) => {
  const [city, setCity] = useState<string | null>(localStorage.getItem('selectedCity'));
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCities = async () => {
      setIsLoading(true);
      try {
        const citiesData = await getCities();
        // Filter only active cities and extract their names
        const cityNames = citiesData
          .filter(city => city.isActive)
          .map(city => city.name);
        
        setAvailableCities(cityNames);
        
        // If the stored city is no longer available, clear it
        if (city && !cityNames.includes(city)) {
          localStorage.removeItem('selectedCity');
          setCity(null);
          toast({
            title: "City no longer available",
            description: "Please select a different city",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Failed to fetch cities:", error);
        toast({
          title: "Error loading cities",
          description: "Could not load available cities. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCities();
  }, [city, toast]);

  const updateCity = (newCity: string) => {
    localStorage.setItem('selectedCity', newCity);
    setCity(newCity);
  };

  return (
    <CityContext.Provider
      value={{ 
        city, 
        currentCity: city, // Added for backward compatibility
        setCity: updateCity, 
        availableCities, 
        isLoading 
      }}
    >
      {children}
    </CityContext.Provider>
  );
};
