
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, TrendingUp, ImageOff, Loader2 } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export type Product = {
  id: string;
  name: string;
  category: string;
  mrp: number;
  sellingPrice: number;
  imageUrl?: string;
  expiryDate?: string;
  quantity?: string;
  isHotDeal?: boolean;
  cities?: string[];
  createdAt?: string;
  updatedAt?: string;
};

type ProductCardProps = {
  product: Product;
  onAddToCart: (product: Product) => void;
};

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const discountPercentage = Math.round(
    ((product.mrp - product.sellingPrice) / product.mrp) * 100
  );

  const handleImageError = () => {
    console.log("Image failed to load:", product.imageUrl);
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    console.log("Image loaded successfully:", product.imageUrl);
    setImageLoading(false);
  };

  return (
    <div className="relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
      {/* Hot Deal Badge */}
      {product.isHotDeal && (
        <div className="absolute top-2 left-2 z-10 bg-xstore-orange rounded-full px-2 py-1 text-xs text-white font-medium flex items-center">
          <TrendingUp size={12} className="mr-1" />
          Hot Deal
        </div>
      )}
      
      {/* Discount Badge */}
      <div className="absolute top-2 right-2 z-10 bg-xstore-green rounded-full px-2 py-1 text-xs text-white font-medium">
        {discountPercentage}% OFF
      </div>
      
      {/* Product Image */}
      <div className="relative w-full">
        <AspectRatio ratio={1/1} className="bg-gray-100">
          {imageLoading && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Skeleton className="h-full w-full absolute" />
              <Loader2 className="h-8 w-8 animate-spin text-gray-400 z-10" />
            </div>
          )}
          
          {!imageError && product.imageUrl ? (
            <img 
              src={product.imageUrl}
              alt={product.name}
              className={cn(
                "object-contain w-full h-full transition-opacity",
                imageLoading ? "opacity-0" : "opacity-100"
              )}
              onError={handleImageError}
              onLoad={handleImageLoad}
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full text-gray-400 bg-gray-50">
              <ImageOff size={32} />
              <p className="mt-2 text-xs">No image available</p>
            </div>
          )}
        </AspectRatio>
      </div>
      
      {/* Product Details */}
      <div className="flex flex-col flex-grow p-4">
        <div className="text-xs text-gray-500 uppercase mb-1">{product.category}</div>
        <h3 className="text-base font-medium mb-2 line-clamp-2">{product.name}</h3>
        
        <div className="flex flex-col flex-grow">
          {product.expiryDate && (
            <div className="text-xs text-gray-500 mb-2">
              Expiry: {product.expiryDate}
            </div>
          )}
          
          {product.quantity && (
            <div className="text-xs text-gray-500 mb-2">
              {product.quantity}
            </div>
          )}
        </div>
        
        <div className="flex items-baseline mb-3">
          <span className="text-lg font-semibold text-xstore-green">
            ₹{product.sellingPrice.toFixed(2)}
          </span>
          <span className="text-sm text-gray-500 line-through ml-2">
            ₹{product.mrp.toFixed(2)}
          </span>
        </div>
        
        <Button 
          onClick={() => onAddToCart(product)}
          className={cn("w-full", !product.imageUrl || imageError ? "mt-auto" : "")}
        >
          <ShoppingCart size={16} className="mr-2" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
