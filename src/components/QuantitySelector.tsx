
import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MinusCircle, PlusCircle } from "lucide-react";

interface QuantitySelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (quantity: number) => void;
  productName: string;
  unitType: 'pieces' | 'kg';
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  isOpen,
  onClose,
  onConfirm,
  productName,
  unitType
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [error, setError] = useState<string>('');

  const handleQuantityChange = (value: number) => {
    if (value < 1) {
      setError(`Minimum quantity is 1 ${unitType}`);
      return;
    }
    
    if (value > 100) {
      setError(`Maximum quantity is 100 ${unitType}`);
      return;
    }
    
    setQuantity(value);
    setError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value)) {
      setQuantity(0);
      setError(`Please enter a valid number`);
      return;
    }
    handleQuantityChange(value);
  };

  const handleConfirm = () => {
    if (quantity < 1) {
      setError(`Minimum quantity is 1 ${unitType}`);
      return;
    }
    
    onConfirm(quantity);
    onClose();
  };

  // Predefined quantity suggestions based on unitType
  const suggestions = unitType === 'pieces' 
    ? [5, 10, 15] 
    : [5, 10, 15];

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Quantity</DialogTitle>
          <DialogDescription>
            How many {unitType} of {productName} would you like?
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          {/* Quick suggestions */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Quick Select:</label>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((value) => (
                <Button
                  key={value}
                  variant={quantity === value ? "default" : "outline"}
                  onClick={() => handleQuantityChange(value)}
                  className="flex-1"
                >
                  {value} {unitType}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Custom quantity input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Custom Quantity:</label>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
              >
                <MinusCircle className="h-4 w-4" />
              </Button>
              
              <div className="flex-1 flex items-center border rounded-md overflow-hidden">
                <Input 
                  type="number"
                  value={quantity || ''}
                  onChange={handleInputChange}
                  min={1}
                  max={100}
                  className="border-0 text-center"
                />
                <span className="px-3 bg-gray-50 text-gray-500 border-l">
                  {unitType}
                </span>
              </div>
              
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => handleQuantityChange(Math.min(100, quantity + 1))}
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
            
            {error && (
              <p className="text-sm text-red-500 mt-1">{error}</p>
            )}
            
            <p className="text-sm text-gray-500 mt-2">
              Example: 5 {unitType}
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={quantity < 1}>
            Add to Cart
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuantitySelector;
