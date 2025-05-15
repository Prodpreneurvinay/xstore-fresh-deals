
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

/**
 * Creates or ensures the products storage bucket exists
 * @returns Promise<boolean> - Success of the operation
 */
export const ensureProductsBucket = async (): Promise<boolean> => {
  try {
    // Check if products bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error("Error listing storage buckets:", listError);
      return false;
    }
    
    const productsBucket = buckets?.find(bucket => bucket.name === 'products');
    
    // If bucket doesn't exist, create it
    if (!productsBucket) {
      console.log("Products bucket does not exist, creating...");
      const { error: createError } = await supabase.storage.createBucket('products', {
        public: true
      });
      
      if (createError) {
        console.error("Failed to create products bucket:", createError);
        toast({
          title: "Storage setup failed",
          description: "Could not create storage for product images",
          variant: "destructive"
        });
        return false;
      }
      
      console.log("Products bucket created successfully");
    }
    
    return true;
  } catch (error) {
    console.error("Error ensuring products bucket exists:", error);
    return false;
  }
};

/**
 * Uploads a file to Supabase Storage
 * @param file - File to upload
 * @param bucketName - Name of the bucket to upload to
 * @param path - Optional path within the bucket
 * @returns Promise<string | null> - URL of the uploaded file or null if upload failed
 */
export const uploadFile = async (
  file: File, 
  bucketName: string,
  path: string = ''
): Promise<string | null> => {
  try {
    // First ensure the bucket exists
    if (bucketName === 'products') {
      const bucketExists = await ensureProductsBucket();
      if (!bucketExists) {
        return null;
      }
    }
    
    // Generate a unique file name to avoid collisions
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${timestamp}-${file.name.replace(/\s+/g, '_')}`;
    const fullPath = path ? `${path}/${fileName}` : fileName;
    
    console.log(`Uploading ${fileName} to ${bucketName}/${path || ''}...`);
    
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
    
    console.log("File uploaded successfully, path:", data?.path);
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data?.path || '');
    
    console.log("Public URL for uploaded file:", publicUrl);
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

/**
 * Checks if the Supabase storage is configured correctly
 * Useful for debugging storage issues
 */
export const checkStorageConfiguration = async (): Promise<void> => {
  try {
    // Check if the products bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error("Error listing buckets:", listError);
      return;
    }
    
    const productsBucket = buckets?.find(bucket => bucket.name === 'products');
    console.log("Products bucket exists:", !!productsBucket);
    
    if (productsBucket) {
      // Try to list files in the bucket to check permissions
      const { data: files, error: listFilesError } = await supabase.storage
        .from('products')
        .list();
        
      if (listFilesError) {
        console.error("Error listing files in products bucket:", listFilesError);
      } else {
        console.log("Files in products bucket:", files);
      }
      
      // Check if the bucket is public
      console.log("Products bucket is public:", productsBucket.public);
    }
  } catch (error) {
    console.error("Error checking storage configuration:", error);
  }
};

