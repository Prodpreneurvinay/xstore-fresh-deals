
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Upload, X, Image, Store, Leaf } from 'lucide-react';
import { Product } from '@/components/ProductCard';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type ProductFormProps = {
  product?: Product;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  availableCities?: string[];
};

export type ProductFormData = Omit<Product, 'id'> & {
  cities: string[];
  imageFile?: File;
  storeType: 'xstore' | 'xstore-fresh';
};

// Category definitions
const XSTORE_CATEGORIES = [
  'Food Items',
  'Beverages',
  'Personal Care',
  'Home Care',
  'Health & Hygiene',
];

const XSTORE_FRESH_CATEGORIES = [
  'Vegetables',
  'Fruits',
  'Dairy',
  'Meat',
  'Frozen'
];

// Map categories to store type
const CATEGORY_TO_STORE_TYPE: Record<string, 'xstore' | 'xstore-fresh'> = {
  'Food Items': 'xstore',
  'Beverages': 'xstore',
  'Personal Care': 'xstore',
  'Home Care': 'xstore',
  'Health & Hygiene': 'xstore',
  'Vegetables': 'xstore-fresh',
  'Fruits': 'xstore-fresh',
  'Dairy': 'xstore-fresh',
  'Meat': 'xstore-fresh',
  'Frozen': 'xstore-fresh',
};

const ProductForm = ({ product, onSubmit, onCancel, availableCities = [] }: ProductFormProps) => {
  const [previewImage, setPreviewImage] = useState<string | undefined>(product?.imageUrl);
  const [selectedStoreType, setSelectedStoreType] = useState<'xstore' | 'xstore-fresh'>(
    product ? CATEGORY_TO_STORE_TYPE[product.category] || 'xstore' : 'xstore'
  );
  const { toast } = useToast();
  
  const form = useForm<ProductFormData>({
    defaultValues: {
      name: product?.name || '',
      category: product?.category || 'Food Items',
      mrp: product?.mrp || 0,
      sellingPrice: product?.sellingPrice || 0,
      imageUrl: product?.imageUrl || '',
      expiryDate: product?.expiryDate || '',
      quantity: product?.quantity || '',
      isHotDeal: product?.isHotDeal || false,
      cities: product?.cities || [],
      storeType: product ? CATEGORY_TO_STORE_TYPE[product.category] || 'xstore' : 'xstore'
    }
  });
  
  // Update category when store type changes
  useEffect(() => {
    if (selectedStoreType === 'xstore') {
      form.setValue('category', XSTORE_CATEGORIES[0]);
    } else {
      form.setValue('category', XSTORE_FRESH_CATEGORIES[0]);
    }
  }, [selectedStoreType, form]);

  // Update store type when category changes
  useEffect(() => {
    const category = form.watch('category');
    if (category) {
      const storeType = CATEGORY_TO_STORE_TYPE[category];
      if (storeType) {
        setSelectedStoreType(storeType);
        form.setValue('storeType', storeType);
      }
    }
  }, [form.watch('category'), form]);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('imageFile', file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      form.setValue('imageUrl', ''); // Clear the external URL since we're uploading a file
    }
  };
  
  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    form.setValue('imageUrl', url);
    setPreviewImage(url);
    form.setValue('imageFile', undefined); // Clear any uploaded file
  };
  
  const handleSubmit = form.handleSubmit((data) => {
    // Validate that at least one city is selected
    if (data.cities.length === 0) {
      toast({
        title: "City selection required",
        description: "Please select at least one city where this product will be available",
        variant: "destructive"
      });
      return;
    }
    
    onSubmit(data);
  });
  
  const removeImage = () => {
    setPreviewImage(undefined);
    form.setValue('imageUrl', '');
    form.setValue('imageFile', undefined);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Store Type Selection */}
        <div className="space-y-2">
          <FormLabel>Store Type</FormLabel>
          <Tabs 
            value={selectedStoreType} 
            onValueChange={(value: 'xstore' | 'xstore-fresh') => {
              setSelectedStoreType(value);
              form.setValue('storeType', value);
            }} 
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 mb-2">
              <TabsTrigger value="xstore" className="flex items-center">
                <Store size={16} className="mr-2" />
                XStore
              </TabsTrigger>
              <TabsTrigger value="xstore-fresh" className="flex items-center">
                <Leaf size={16} className="mr-2" />
                XStore Fresh
              </TabsTrigger>
            </TabsList>
            <p className="text-sm text-gray-500 mb-2">
              {selectedStoreType === 'xstore' ? 
                'XStore - For FMCG items like food, beverages, and personal care products.' : 
                'XStore Fresh - For fresh items like vegetables, fruits, meat, and dairy products.'}
            </p>
          </Tabs>
        </div>

        {/* Product Image */}
        <div className="space-y-2">
          <FormLabel>Product Image</FormLabel>
          <div className="flex flex-col items-center space-y-2">
            {previewImage ? (
              <div className="relative w-full max-w-[200px] aspect-square mb-4">
                <img
                  src={previewImage}
                  alt="Product preview"
                  className="w-full h-full object-cover rounded-md"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={removeImage}
                  className="absolute top-2 right-2 h-8 w-8"
                >
                  <X size={16} />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 w-full text-center">
                <Image size={48} className="mx-auto text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">No image selected</p>
              </div>
            )}
            
            <div className="grid w-full gap-4">
              <div>
                <Label htmlFor="image-upload">Upload Image</Label>
                <div className="flex mt-1">
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="image-url">Or use image URL</Label>
                <Input
                  id="image-url"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={form.watch('imageUrl')}
                  onChange={handleImageUrlChange}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Basic Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {selectedStoreType === 'xstore' ? (
                      XSTORE_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))
                    ) : (
                      XSTORE_FRESH_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="mrp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>MRP (₹)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    placeholder="Enter MRP" 
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="sellingPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Selling Price (₹)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    placeholder="Enter selling price" 
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity/Weight</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 500g, 1kg, 10 x 100g" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="expiryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expiry Date</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 15 Jun 2025" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Hot Deal Checkbox */}
        <FormField
          control={form.control}
          name="isHotDeal"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
              <FormControl>
                <Checkbox 
                  checked={field.value} 
                  onCheckedChange={field.onChange} 
                />
              </FormControl>
              <FormLabel className="font-normal">Mark as Hot Deal</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* City Availability */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <FormLabel>City Availability</FormLabel>
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => form.setValue('cities', [])}
              >
                Clear All
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => form.setValue('cities', [...availableCities])}
              >
                Select All
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-4 border rounded-md">
            {availableCities.length > 0 ? (
              availableCities.map((city) => (
                <div key={city} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`city-${city}`} 
                    onCheckedChange={(checked) => {
                      const currentCities = form.watch('cities');
                      if (checked) {
                        form.setValue('cities', [...currentCities, city]);
                      } else {
                        form.setValue('cities', currentCities.filter(c => c !== city));
                      }
                    }}
                    checked={form.watch('cities').includes(city)}
                  />
                  <label
                    htmlFor={`city-${city}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {city}
                  </label>
                </div>
              ))
            ) : (
              <div className="col-span-4 text-center py-4 text-gray-500">
                No cities available. Please add cities first.
              </div>
            )}
          </div>
          {form.watch('cities').length > 0 && (
            <div className="text-sm text-gray-500">
              Selected {form.watch('cities').length} of {availableCities.length} cities
            </div>
          )}
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-xstore-green">
            Save Product
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
