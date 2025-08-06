
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Product } from '../components/ProductCard';
import { useToast } from '@/components/ui/use-toast';

// Types
export type CartItem = {
  product: Product;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  total: number;
  itemCount: number;
};

type CartAction = 
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

type CartContextType = {
  cart: CartState;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
};

// Initial state
const initialCartState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
};

// Reducer function
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find(item => item.product.id === product.id);
      
      if (existingItem) {
        // Increment quantity if item exists
        const updatedItems = state.items.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
        
        return {
          ...state,
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + (item.product.sellingPrice * item.quantity), 0),
          itemCount: updatedItems.reduce((count, item) => count + item.quantity, 0),
        };
      } else {
        // Add new item
        const newItem = { product, quantity };
        const updatedItems = [...state.items, newItem];
        
        return {
          ...state,
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + (item.product.sellingPrice * item.quantity), 0),
          itemCount: updatedItems.reduce((count, item) => count + item.quantity, 0),
        };
      }
    }
    
    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.product.id !== action.payload.id);
      
      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + (item.product.sellingPrice * item.quantity), 0),
        itemCount: updatedItems.reduce((count, item) => count + item.quantity, 0),
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item => 
        item.product.id === action.payload.id 
          ? { ...item, quantity: action.payload.quantity } 
          : item
      );
      
      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + (item.product.sellingPrice * item.quantity), 0),
        itemCount: updatedItems.reduce((count, item) => count + item.quantity, 0),
      };
    }
    
    case 'CLEAR_CART':
      return initialCartState;
      
    default:
      return state;
  }
};

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialCartState, () => {
    // Load cart from localStorage on initial render with validation
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        
        // Validate cart structure
        if (parsedCart && 
            Array.isArray(parsedCart.items) && 
            typeof parsedCart.total === 'number' && 
            typeof parsedCart.itemCount === 'number') {
          
          // Validate each cart item
          const validItems = parsedCart.items.filter((item: any) => {
            return item && 
                   item.product && 
                   typeof item.product.id === 'string' &&
                   typeof item.product.name === 'string' &&
                   typeof item.product.sellingPrice === 'number' &&
                   typeof item.quantity === 'number' &&
                   item.quantity > 0;
          });
          
          // If all items are valid, return the cart; otherwise recalculate
          if (validItems.length === parsedCart.items.length) {
            return parsedCart;
          } else {
            console.warn('Some cart items were invalid and removed');
            // Recalculate cart with valid items
            const total = validItems.reduce((sum: number, item: any) => 
              sum + (item.product.sellingPrice * item.quantity), 0);
            const itemCount = validItems.reduce((count: number, item: any) => 
              count + item.quantity, 0);
            
            return {
              items: validItems,
              total,
              itemCount
            };
          }
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      // Clear corrupted cart data
      localStorage.removeItem('cart');
    }
    
    return initialCartState;
  });
  
  const { toast } = useToast();
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
  
  // Actions
  const addToCart = (product: Product, quantity: number = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
    toast({
      title: "Added to cart",
      description: `${quantity} ${quantity === 1 ? 'unit' : 'units'} of ${product.name} has been added to your cart.`,
    });
  };
  
  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };
  
  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  
  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
  
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
