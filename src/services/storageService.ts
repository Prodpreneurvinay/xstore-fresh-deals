
import { supabase } from "@/integrations/supabase/client";

export const createStorageBucket = async (): Promise<void> => {
  try {
    // Check if the bucket already exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === 'products');
    
    if (!bucketExists) {
      // Create the bucket
      const { data, error } = await supabase.storage.createBucket('products', {
        public: true
      });
      
      if (error) {
        console.error("Error creating storage bucket:", error);
      } else {
        console.log("Storage bucket created:", data);
      }
    }
  } catch (error) {
    console.error("Error in createStorageBucket:", error);
  }
};

// Initialize storage when the app starts
createStorageBucket();
