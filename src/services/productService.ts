
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { Product } from "@/components/ProductCard";
import { ProductFormData } from "@/components/ProductForm";

// Type for product from database
type DatabaseProduct = Database['public']['Tables']['products']['Row'];
type DatabaseCity = Database['public']['Tables']['cities']['Row'];

// Convert database product to frontend product
const mapDatabaseProductToProduct = (dbProduct: DatabaseProduct, cities: string[] = []): Product => {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    category: dbProduct.category,
    mrp: dbProduct.mrp,
    sellingPrice: dbProduct.selling_price,
    imageUrl: dbProduct.image_url || undefined,
    expiryDate: dbProduct.expiry_date || undefined,
    quantity: dbProduct.quantity || undefined,
    isHotDeal: dbProduct.is_hot_deal || false,
    cities
  };
};

// Get all cities from database
export const getCities = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('cities')
      .select('*');

    if (error) {
      console.error("Error fetching cities:", error);
      toast({
        title: "Failed to fetch cities",
        description: error.message,
        variant: "destructive"
      });
      return [];
    }

    return data.map(city => city.name);
  } catch (error) {
    console.error("Error in getCities:", error);
    toast({
      title: "An unexpected error occurred",
      description: "Could not fetch cities",
      variant: "destructive"
    });
    return [];
  }
};

// Get city IDs by names
export const getCityIdsByNames = async (cityNames: string[]): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('cities')
      .select('id, name')
      .in('name', cityNames);

    if (error) {
      console.error("Error fetching city IDs:", error);
      return [];
    }

    return data.map(city => city.id);
  } catch (error) {
    console.error("Error in getCityIdsByNames:", error);
    return [];
  }
};

// Get product cities
export const getProductCities = async (productId: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('product_cities')
      .select('cities(name)')
      .eq('product_id', productId);

    if (error) {
      console.error("Error fetching product cities:", error);
      return [];
    }

    return data.map(item => (item.cities as any)?.name || '').filter(Boolean);
  } catch (error) {
    console.error("Error in getProductCities:", error);
    return [];
  }
};

// Upload image to Supabase Storage
export const uploadProductImage = async (file: File): Promise<string | null> => {
  try {
    // Generate a unique file path
    const filePath = `products/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    
    const { error, data } = await supabase.storage
      .from('products')
      .upload(filePath, file);

    if (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Image upload failed",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }

    // Get public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error("Error in uploadProductImage:", error);
    toast({
      title: "Image upload failed",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return null;
  }
};

// Get all products
export const getProducts = async (): Promise<Product[]> => {
  try {
    // Fetch products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*');

    if (productsError) {
      console.error("Error fetching products:", productsError);
      toast({
        title: "Failed to fetch products",
        description: productsError.message,
        variant: "destructive"
      });
      return [];
    }

    // Fetch product cities relationships
    const productCitiesMap = new Map<string, string[]>();
    
    // Process each product to get its cities
    const productsWithCities = await Promise.all(products.map(async (product) => {
      const cities = await getProductCities(product.id);
      return mapDatabaseProductToProduct(product, cities);
    }));

    return productsWithCities;
  } catch (error) {
    console.error("Error in getProducts:", error);
    toast({
      title: "An unexpected error occurred",
      description: "Could not fetch products",
      variant: "destructive"
    });
    return [];
  }
};

// Create or update product
export const saveProduct = async (productData: ProductFormData, existingProductId?: string): Promise<Product | null> => {
  try {
    let imageUrl = productData.imageUrl;

    // Upload the image if provided
    if (productData.imageFile) {
      const uploadedImageUrl = await uploadProductImage(productData.imageFile);
      if (uploadedImageUrl) {
        imageUrl = uploadedImageUrl;
      }
    }

    // Prepare product data for database
    const productForDb = {
      name: productData.name,
      category: productData.category,
      mrp: productData.mrp,
      selling_price: productData.sellingPrice,
      image_url: imageUrl || null,
      expiry_date: productData.expiryDate || null,
      quantity: productData.quantity || null,
      is_hot_deal: productData.isHotDeal || false,
      updated_at: new Date().toISOString()
    };

    let productId = existingProductId;
    let operation;

    // Insert or update the product
    if (existingProductId) {
      // Update existing product
      operation = supabase
        .from('products')
        .update(productForDb)
        .eq('id', existingProductId)
        .select();
    } else {
      // Create new product
      operation = supabase
        .from('products')
        .insert(productForDb)
        .select();
    }

    const { data: savedProduct, error: productError } = await operation;

    if (productError) {
      console.error("Error saving product:", productError);
      toast({
        title: "Failed to save product",
        description: productError.message,
        variant: "destructive"
      });
      return null;
    }

    productId = savedProduct[0].id;

    // Get city IDs from names
    const cityIds = await getCityIdsByNames(productData.cities);

    // First delete existing product-city relationships
    if (existingProductId) {
      await supabase
        .from('product_cities')
        .delete()
        .eq('product_id', existingProductId);
    }

    // Insert new product-city relationships
    if (cityIds.length > 0) {
      const productCities = cityIds.map(cityId => ({
        product_id: productId,
        city_id: cityId
      }));

      const { error: productCitiesError } = await supabase
        .from('product_cities')
        .insert(productCities);

      if (productCitiesError) {
        console.error("Error saving product cities:", productCitiesError);
      }
    }

    return mapDatabaseProductToProduct(savedProduct[0], productData.cities);
  } catch (error) {
    console.error("Error in saveProduct:", error);
    toast({
      title: "An unexpected error occurred",
      description: "Could not save product",
      variant: "destructive"
    });
    return null;
  }
};

// Delete product
export const deleteProduct = async (productId: string): Promise<boolean> => {
  try {
    // Delete product (this will cascade to product_cities due to foreign key constraints)
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Failed to delete product",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    toast({
      title: "An unexpected error occurred",
      description: "Could not delete product",
      variant: "destructive"
    });
    return false;
  }
};
