
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
 * Uploads a file to Supabase Storage with optimized settings for product images
 * @param file - File to upload
 * @returns Promise<string | null> - URL of the uploaded file or null if upload failed
 */
export const uploadFile = async (file: File): Promise<string | null> => {
  try {
    console.log("Starting upload process for file:", file.name);
    
    // First ensure the products bucket exists
    const bucketExists = await ensureProductsBucket();
    if (!bucketExists) {
      console.error("Products bucket doesn't exist and couldn't be created");
      toast({
        title: "Upload failed",
        description: "Storage bucket is not available. Please try again later.",
        variant: "destructive"
      });
      return null;
    }
    
    // Check file size (limit to 5MB for example)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Please select an image under 5MB",
        variant: "destructive"
      });
      return null;
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive"
      });
      return null;
    }

    // Generate a unique file name to avoid collisions
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 10);
    const fileExtension = file.name.split('.').pop();
    const fileName = `product-${timestamp}-${randomString}.${fileExtension}`;
    
    console.log(`Uploading ${fileName} to products bucket...`);
    
    // Upload the file - use direct storage operations instead of RPC
    const { data, error } = await supabase.storage
      .from('products')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
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
      .from('products')
      .getPublicUrl(data?.path || '');
    
    console.log("Public URL for uploaded file:", publicUrl);
    return publicUrl;
  } catch (error) {
    console.error("Error in uploadFile:", error);
    toast({
      title: "Upload failed",
      description: "An unexpected error occurred during upload",
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
    console.log("Checking storage configuration...");
    
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
