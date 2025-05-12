
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import ProductCard, { Product } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useCity } from '@/context/CityContext';
import { Filter, Search, ShoppingCart, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

// Mock product data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Nestle Maggi Noodles (Pack of 12)',
    category: 'Food Items',
    mrp: 160,
    sellingPrice: 120,
    imageUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9',
    expiryDate: '10 Jun 2025',
    quantity: '12 x 70g',
    isHotDeal: true
  },
  {
    id: '2',
    name: 'Britannia Good Day Biscuits',
    category: 'Food Items',
    mrp: 100,
    sellingPrice: 75,
    imageUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9',
    expiryDate: '15 May 2025',
    quantity: '1 kg',
  },
  {
    id: '3',
    name: 'Tata Tea Gold',
    category: 'Beverages',
    mrp: 250,
    sellingPrice: 200,
    imageUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9',
    expiryDate: '22 Jul 2025',
    quantity: '500g',
    isHotDeal: true
  },
  {
    id: '4',
    name: 'Sunsilk Shampoo',
    category: 'Personal Care',
    mrp: 180,
    sellingPrice: 140,
    imageUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9',
    expiryDate: '30 Aug 2025',
    quantity: '650ml',
  },
  {
    id: '5',
    name: 'Colgate Toothpaste (Pack of 4)',
    category: 'Personal Care',
    mrp: 220,
    sellingPrice: 180,
    imageUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9',
    expiryDate: '15 Jun 2025',
    quantity: '4 x 150g',
    isHotDeal: true
  },
  {
    id: '6',
    name: 'Surf Excel Detergent Powder',
    category: 'Home Care',
    mrp: 550,
    sellingPrice: 470,
    imageUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9',
    expiryDate: '12 Sep 2025',
    quantity: '4 kg',
  },
  {
    id: '7',
    name: 'Parle-G Original Biscuits (Pack of 10)',
    category: 'Food Items',
    mrp: 120,
    sellingPrice: 90,
    imageUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9',
    expiryDate: '18 Jul 2025',
    quantity: '10 x 100g',
  },
  {
    id: '8',
    name: 'Dettol Hand Sanitizer (Pack of 3)',
    category: 'Health & Hygiene',
    mrp: 350,
    sellingPrice: 280,
    imageUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9',
    expiryDate: '09 Aug 2025',
    quantity: '3 x 200ml',
    isHotDeal: true
  },
];

// Extract unique categories
const categories = ['All Products', ...Array.from(new Set(mockProducts.map(product => product.category)))];

const Products = () => {
  const { cart, addToCart } = useCart();
  const { currentCity } = useCity();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [showHotDealsOnly, setShowHotDealsOnly] = useState(false);
  
  // Filter products based on search, category, and hot deals
  const filteredProducts = mockProducts
    .filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(product => selectedCategory === 'All Products' || product.category === selectedCategory)
    .filter(product => !showHotDealsOnly || product.isHotDeal);

  // Handle view cart click
  const handleViewCart = () => {
    navigate('/cart');
  };
  
  // Redirect to city selection if no city is selected
  if (!currentCity) {
    navigate('/select-city');
    return null;
  }
  
  return (
    <Layout cartItemCount={cart.itemCount} currentCity={currentCity}>
      <div className="container-custom py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Products in {currentCity}</h1>
            <p className="text-gray-600 mt-1">Browse our extensive collection of products</p>
          </div>
          
          {/* Cart Summary Button - Only visible if there are items */}
          {cart.itemCount > 0 && (
            <Button 
              onClick={handleViewCart} 
              className="flex items-center gap-2 bg-xstore-green"
            >
              <ShoppingCart size={18} />
              <span>View Cart ({cart.itemCount})</span>
              <span className="font-bold">₹{cart.total.toFixed(2)}</span>
            </Button>
          )}
        </div>
        
        {/* Filters and Search */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-grow">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              <Filter size={18} className="text-gray-500 flex-shrink-0" />
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={selectedCategory === category ? "bg-xstore-green" : ""}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
              
              {/* Hot Deals Toggle */}
              <Button
                variant={showHotDealsOnly ? "default" : "outline"}
                className={`flex items-center gap-1 ${showHotDealsOnly ? "bg-xstore-orange" : ""}`}
                size="sm"
                onClick={() => setShowHotDealsOnly(!showHotDealsOnly)}
              >
                <TrendingUp size={16} />
                Hot Deals
              </Button>
            </div>
          </div>
        </div>
        
        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium text-gray-600">No products found</h3>
            <p className="mt-2 text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Products;
