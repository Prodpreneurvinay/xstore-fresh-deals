
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { ensureProductsBucket, checkStorageConfiguration } from '@/services/storageService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Check, X, Database } from 'lucide-react';

const StorageDashboard = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [bucketExists, setBucketExists] = useState<boolean | null>(null);
  const [bucketIsPublic, setBucketIsPublic] = useState<boolean | null>(null);
  const [fileCount, setFileCount] = useState<number | null>(null);
  
  const checkBucketStatus = async () => {
    setIsChecking(true);
    try {
      // Check if bucket exists
      const { data: buckets, error } = await supabase.storage.listBuckets();
      
      if (error) {
        console.error("Error checking buckets:", error);
        toast({
          title: "Error",
          description: "Could not check storage status",
          variant: "destructive",
        });
        setBucketExists(false);
        return;
      }
      
      const productBucket = buckets?.find(b => b.name === 'products');
      setBucketExists(!!productBucket);
      setBucketIsPublic(productBucket?.public || false);
      
      // If bucket exists, check files
      if (productBucket) {
        const { data: files, error: filesError } = await supabase.storage
          .from('products')
          .list();
          
        if (filesError) {
          console.error("Error listing files:", filesError);
        } else {
          setFileCount(files?.length || 0);
        }
      }
    } catch (e) {
      console.error("Error in bucket check:", e);
    } finally {
      setIsChecking(false);
    }
  };
  
  const createBucket = async () => {
    setIsChecking(true);
    try {
      const success = await ensureProductsBucket();
      if (success) {
        toast({
          title: "Success",
          description: "Products bucket created successfully",
        });
        await checkBucketStatus();
      }
    } catch (e) {
      console.error("Error creating bucket:", e);
      toast({
        title: "Error",
        description: "Could not create products bucket",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };
  
  useEffect(() => {
    checkBucketStatus();
  }, []);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Storage Status</CardTitle>
        <CardDescription>Check the status of your product images storage</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 border rounded-md">
            <div className="flex items-center gap-2">
              <Database size={20} />
              <span>Products Bucket</span>
            </div>
            {isChecking ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              <div className="flex items-center">
                {bucketExists ? (
                  <Check className="text-green-500 mr-2" />
                ) : (
                  <X className="text-red-500 mr-2" />
                )}
                <span>{bucketExists ? "Exists" : "Missing"}</span>
              </div>
            )}
          </div>
          
          {bucketExists && (
            <>
              <div className="flex justify-between items-center p-3 border rounded-md">
                <span>Public Access</span>
                {isChecking ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  <div className="flex items-center">
                    {bucketIsPublic ? (
                      <Check className="text-green-500 mr-2" />
                    ) : (
                      <X className="text-red-500 mr-2" />
                    )}
                    <span>{bucketIsPublic ? "Enabled" : "Disabled"}</span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center p-3 border rounded-md">
                <span>Files Stored</span>
                {isChecking ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  <span className="font-medium">{fileCount !== null ? fileCount : "Unknown"}</span>
                )}
              </div>
            </>
          )}
          
          {!bucketExists && !isChecking && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800">
              <p className="font-medium">The products bucket does not exist!</p>
              <p className="text-sm mt-1">This is required for storing product images.</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          onClick={checkBucketStatus}
          variant="outline"
          disabled={isChecking}
        >
          {isChecking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Refresh Status
        </Button>
        
        {!bucketExists && !isChecking && (
          <Button onClick={createBucket}>
            Create Products Bucket
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default StorageDashboard;
