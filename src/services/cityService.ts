
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface City {
  id: string;
  name: string;
  isActive: boolean;
}

export const getCities = async (): Promise<City[]> => {
  try {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching cities:', error);
      throw error;
    }
    
    // Transform data to include isActive property
    const cities = data.map(city => ({
      ...city,
      isActive: true // By default all cities in the database are active
    }));
    
    return cities;
  } catch (error) {
    console.error('Error in getCities:', error);
    return [];
  }
};

export interface CityFormData {
  name: string;
  isActive: boolean;
}

export const saveCity = async (data: CityFormData, cityId?: string): Promise<City | null> => {
  try {
    if (cityId) {
      // Update existing city
      const { data: updatedCity, error } = await supabase
        .from('cities')
        .update({ name: data.name })
        .eq('id', cityId)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating city:', error);
        throw error;
      }
      
      return { ...updatedCity, isActive: data.isActive };
    } else {
      // Create new city
      const { data: newCity, error } = await supabase
        .from('cities')
        .insert({ name: data.name })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating city:', error);
        throw error;
      }
      
      return { ...newCity, isActive: data.isActive };
    }
  } catch (error) {
    console.error('Error in saveCity:', error);
    toast({
      title: 'Error',
      description: 'Failed to save city. Please try again.',
      variant: 'destructive'
    });
    return null;
  }
};

export const deleteCity = async (cityId: string): Promise<boolean> => {
  try {
    // First check if city is associated with any products
    const { data: productCities, error: checkError } = await supabase
      .from('product_cities')
      .select('id')
      .eq('city_id', cityId);
    
    if (checkError) {
      console.error('Error checking product associations:', checkError);
      throw checkError;
    }
    
    if (productCities && productCities.length > 0) {
      toast({
        title: 'Cannot Delete City',
        description: 'This city is associated with products. Remove these associations first.',
        variant: 'destructive'
      });
      return false;
    }
    
    // If no associations, proceed with deletion
    const { error } = await supabase
      .from('cities')
      .delete()
      .eq('id', cityId);
    
    if (error) {
      console.error('Error deleting city:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteCity:', error);
    toast({
      title: 'Error',
      description: 'Failed to delete city. Please try again.',
      variant: 'destructive'
    });
    return false;
  }
};
