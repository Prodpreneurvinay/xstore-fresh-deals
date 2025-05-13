
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { 
  Search,
  Plus,
  Edit,
  Trash,
  Check,
  X,
  Loader2
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from '@/components/ui/dialog';
import CityForm from '@/components/CityForm';
import { City, getCities, saveCity, deleteCity, CityFormData } from '@/services/cityService';

const CitiesTab: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCityForm, setShowCityForm] = useState(false);
  const [currentCity, setCurrentCity] = useState<City | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Fetch cities when component mounts
  useEffect(() => {
    fetchCities();
  }, []);
  
  const fetchCities = async () => {
    setLoading(true);
    try {
      const fetchedCities = await getCities();
      setCities(fetchedCities);
    } catch (error) {
      console.error("Error fetching cities:", error);
      toast({
        title: "Failed to fetch cities",
        description: "Please check your connection and try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const filteredCities = cities.filter(city => 
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAddCity = () => {
    setCurrentCity(undefined);
    setShowCityForm(true);
  };
  
  const handleEditCity = (city: City) => {
    setCurrentCity(city);
    setShowCityForm(true);
  };
  
  const handleDeleteCity = async (cityId: string) => {
    const success = await deleteCity(cityId);
    if (success) {
      setCities(cities.filter(c => c.id !== cityId));
      toast({
        title: "City Deleted",
        description: "The city has been successfully deleted.",
      });
    }
  };
  
  const handleCitySubmit = async (data: CityFormData) => {
    setLoading(true);
    
    try {
      const savedCity = await saveCity(data, currentCity?.id);
      
      if (savedCity) {
        if (currentCity) {
          // Update existing city in the state
          setCities(cities.map(c => 
            c.id === currentCity.id ? savedCity : c
          ));
          toast({
            title: "City Updated",
            description: "The city has been successfully updated.",
          });
        } else {
          // Add new city to state
          setCities([...cities, savedCity]);
          toast({
            title: "City Added",
            description: "The city has been successfully added.",
          });
        }
        setShowCityForm(false);
      }
    } catch (error) {
      console.error("Error saving city:", error);
      toast({
        title: "Error",
        description: "Failed to save the city. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Cities</h2>
        <Button className="bg-xstore-green" onClick={handleAddCity}>
          <Plus size={16} className="mr-2" />
          Add City
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search cities..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {loading ? (
          <div className="p-16 flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-xstore-green" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCities.map((city) => (
                  <TableRow key={city.id}>
                    <TableCell className="font-medium">{city.name}</TableCell>
                    <TableCell>
                      {city.isActive ? (
                        <span className="flex items-center text-green-600">
                          <Check size={16} className="mr-1" /> Active
                        </span>
                      ) : (
                        <span className="flex items-center text-red-600">
                          <X size={16} className="mr-1" /> Inactive
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditCity(city)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500"
                          onClick={() => handleDeleteCity(city.id)}
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        
        {!loading && filteredCities.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No cities found. Try adjusting your search or add a new city.</p>
          </div>
        ) : (
          <div className="p-4 border-t flex justify-between items-center">
            <span className="text-sm text-gray-500">
              Showing {filteredCities.length} of {cities.length} cities
            </span>
          </div>
        )}
      </div>
      
      {/* City Form Dialog */}
      <Dialog open={showCityForm} onOpenChange={setShowCityForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{currentCity ? 'Edit City' : 'Add New City'}</DialogTitle>
          </DialogHeader>
          {loading ? (
            <div className="p-16 flex justify-center items-center">
              <Loader2 className="h-8 w-8 animate-spin text-xstore-green" />
            </div>
          ) : (
            <CityForm 
              city={currentCity}
              onSubmit={handleCitySubmit}
              onCancel={() => setShowCityForm(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CitiesTab;
