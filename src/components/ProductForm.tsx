
import React, { useState } from 'react';
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
import { Upload, X, Image } from 'lucide-react';
import { AVAILABLE_CITIES } from '@/context/CityContext';
import { Product } from '@/components/ProductCard';

type ProductFormProps = {
  product?: Product;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
};

export type ProductFormData = Omit<Product, 'id'> & {
  cities: string[];
  imageFile?: File;
};

const CATEGORIES = [
  'Food Items',
  'Beverages',
  'Personal Care',
  'Home Care',
  'Health & Hygiene',
  'Vegetables',
  'Fruits',
  'Dairy',
  'Meat',
  'Frozen'
];

const ProductForm = ({ product, onSubmit, onCancel }: ProductFormProps) => {
  const [previewImage, setPreviewImage] = useState<string | undefined>(product?.imageUrl);
  
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
      cities: []
    }
  });
  
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
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
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
          <FormLabel>City Availability</FormLabel>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {AVAILABLE_CITIES.map((city) => (
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
            ))}
          </div>
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
