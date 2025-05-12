
import React, { createContext, useContext, useState, useEffect } from 'react';

type CityContextType = {
  currentCity: string | undefined;
  setCity: (city: string) => void;
  clearCity: () => void;
};

const CityContext = createContext<CityContextType | undefined>(undefined);

export const AVAILABLE_CITIES = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
];

export const CityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentCity, setCurrentCity] = useState<string | undefined>(() => {
    const savedCity = localStorage.getItem('selectedCity');
    return savedCity || undefined;
  });
  
  useEffect(() => {
    if (currentCity) {
      localStorage.setItem('selectedCity', currentCity);
    } else {
      localStorage.removeItem('selectedCity');
    }
  }, [currentCity]);
  
  const setCity = (city: string) => {
    setCurrentCity(city);
  };
  
  const clearCity = () => {
    setCurrentCity(undefined);
  };
  
  return (
    <CityContext.Provider value={{ currentCity, setCity, clearCity }}>
      {children}
    </CityContext.Provider>
  );
};

export const useCity = () => {
  const context = useContext(CityContext);
  if (context === undefined) {
    throw new Error('useCity must be used within a CityProvider');
  }
  return context;
};
