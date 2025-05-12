
import React from 'react';
import { Product } from './ProductCard';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';

type CartItemProps = {
  product: Product;
  quantity: number;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
};

const CartItem = ({ product, quantity, onUpdateQuantity, onRemove }: CartItemProps) => {
  return (
    <div className="flex items-start py-4 border-b border-gray-100">
      {/* Product Image */}
      <div className="w-20 h-20 rounded-md overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Product Details */}
      <div className="flex-1 ml-4">
        <div className="flex flex-col sm:flex-row sm:justify-between">
          <h4 className="font-medium">{product.name}</h4>
          <div className="mt-1 sm:mt-0 sm:text-right">
            <span className="text-xstore-green font-semibold">₹{(product.sellingPrice * quantity).toFixed(2)}</span>
            <div className="text-xs text-gray-500">
              <span className="line-through">₹{(product.mrp * quantity).toFixed(2)}</span>
              {' '}({Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100)}% off)
            </div>
          </div>
        </div>
        
        {product.expiryDate && (
          <div className="text-xs text-gray-500 mt-1">
            Expiry: {product.expiryDate}
          </div>
        )}
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-7 w-7 rounded-md"
              onClick={() => quantity > 1 && onUpdateQuantity(product.id, quantity - 1)}
            >
              <Minus size={14} />
            </Button>
            <span className="w-10 text-center">{quantity}</span>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-7 w-7 rounded-md"
              onClick={() => onUpdateQuantity(product.id, quantity + 1)}
            >
              <Plus size={14} />
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onRemove(product.id)}
            className="text-gray-500 hover:text-red-500"
          >
            <Trash2 size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
