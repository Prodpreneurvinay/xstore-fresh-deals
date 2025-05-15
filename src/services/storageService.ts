
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

// Initialize storage when the app starts
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
        toast({
          title: "Storage Error",
          description: "Failed to create products storage bucket.",
          variant: "destructive"
        });
      } else {
        console.log("Storage bucket created:", data);
      }
    }

    // Ensure public access policy exists for the bucket
    // Fixing the type issue by removing the 'as string' cast
    const { error: policyError } = await supabase.rpc('create_storage_policy', { 
      bucket_id: 'products'
    });
    
    if (policyError && !policyError.message.includes("already exists")) {
      console.error("Error creating storage policy:", policyError);
    }
  } catch (error) {
    console.error("Error in createStorageBucket:", error);
  }
};

// Get public URL for an image
export const getPublicUrl = (filePath: string): string => {
  try {
    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);
      
    return publicUrl;
  } catch (error) {
    console.error("Error getting public URL:", error);
    return '';
  }
};

// Initialize storage on application startup
createStorageBucket().catch(console.error);
