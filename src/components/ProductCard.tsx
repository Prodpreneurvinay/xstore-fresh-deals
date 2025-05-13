import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, TrendingUp } from 'lucide-react';

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
  const discountPercentage = Math.round(
    ((product.mrp - product.sellingPrice) / product.mrp) * 100
  );

  return (
    <div className="product-card">
      {/* Hot Deal Badge */}
      {product.isHotDeal && (
        <div className="absolute top-2 left-2 bg-xstore-orange rounded-full px-2 py-1 text-xs text-white font-medium flex items-center">
          <TrendingUp size={12} className="mr-1" />
          Hot Deal
        </div>
      )}
      
      {/* Discount Badge */}
      <div className="absolute top-2 right-2 bg-xstore-green rounded-full px-2 py-1 text-xs text-white font-medium">
        {discountPercentage}% OFF
      </div>
      
      {/* Product Image */}
      <div className="aspect-square overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Product Details */}
      <div className="p-4">
        <div className="text-xs text-gray-500 uppercase mb-1">{product.category}</div>
        <h3 className="text-base font-medium mb-2 line-clamp-2">{product.name}</h3>
        
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
          className="w-full"
        >
          <ShoppingCart size={16} className="mr-2" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
