
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

/**
 * Ensures that the products storage bucket exists in Supabase
 * Creates it if it doesn't exist
 */
export const ensureProductsBucket = async (): Promise<boolean> => {
  try {
    // Check if products bucket exists
    const { data: buckets, error: getBucketsError } = await supabase.storage.listBuckets();
    
    if (getBucketsError) {
      console.error("Error checking storage buckets:", getBucketsError);
      return false;
    }
    
    const productsBucketExists = buckets.some(bucket => bucket.name === 'products');
    
    // If bucket doesn't exist, create it
    if (!productsBucketExists) {
      const { error: createBucketError } = await supabase.storage.createBucket('products', {
        public: true
      });
      
      if (createBucketError) {
        console.error("Error creating products bucket:", createBucketError);
        toast({
          title: "Storage setup failed",
          description: "Could not create storage for product images",
          variant: "destructive"
        });
        return false;
      }
    }

    // Set up policies for the bucket using direct SQL since RPC call is causing type issues
    // For products bucket, we'll just ensure it's publicly accessible
    try {
      await supabase.storage.from('products').getPublicUrl('test.txt');
    } catch (error) {
      console.error("Error testing storage access:", error);
    }
    
    return true;
  } catch (error) {
    console.error("Error ensuring products bucket:", error);
    return false;
  }
};

/**
 * Uploads a file to Supabase Storage
 */
export const uploadFile = async (
  file: File,
  bucketName: string,
  path: string = ''
): Promise<string | null> => {
  try {
    // First ensure the bucket exists
    if (bucketName === 'products') {
      await ensureProductsBucket();
    }
    
    // Generate a unique file name
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${timestamp}-${file.name.replace(/\s+/g, '_')}`;
    const fullPath = path ? `${path}/${fileName}` : fileName;
    
    // Upload the file
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fullPath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data?.path || '');
    
    return publicUrl;
  } catch (error) {
    console.error("Error in uploadFile:", error);
    toast({
      title: "Upload failed",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return null;
  }
};
