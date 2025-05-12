
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import ProductCard, { Product } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useCity } from '@/context/CityContext';
import { Filter, Search, ShoppingCart, Leaf } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

// Mock fresh product data
const mockFreshProducts: Product[] = [
  {
    id: 'f1',
    name: 'Fresh Tomatoes',
    category: 'Vegetables',
    mrp: 60,
    sellingPrice: 45,
    imageUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9',
    quantity: '1 kg',
    isHotDeal: true
  },
  {
    id: 'f2',
    name: 'Onions',
    category: 'Vegetables',
    mrp: 40,
    sellingPrice: 32,
    imageUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9',
    quantity: '1 kg',
  },
  {
    id: 'f3',
    name: 'Apples',
    category: 'Fruits',
    mrp: 180,
    sellingPrice: 150,
    imageUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9',
    quantity: '1 kg',
    isHotDeal: true
  },
  {
    id: 'f4',
    name: 'Bananas',
    category: 'Fruits',
    mrp: 60,
    sellingPrice: 50,
    imageUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9',
    quantity: '1 dozen',
  },
  {
    id: 'f5',
    name: 'Paneer',
    category: 'Dairy',
    mrp: 320,
    sellingPrice: 280,
    imageUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9',
    quantity: '500g',
    isHotDeal: true
  },
  {
    id: 'f6',
    name: 'Chicken Breast',
    category: 'Meat',
    mrp: 350,
    sellingPrice: 320,
    imageUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9',
    quantity: '500g',
  },
  {
    id: 'f7',
    name: 'Mixed Vegetables',
    category: 'Frozen',
    mrp: 120,
    sellingPrice: 99,
    imageUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9',
    quantity: '500g',
  },
  {
    id: 'f8',
    name: 'French Fries',
    category: 'Frozen',
    mrp: 160,
    sellingPrice: 135,
    imageUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9',
    quantity: '400g',
    isHotDeal: true
  },
];

// Extract unique categories
const categories = ['All Products', ...Array.from(new Set(mockFreshProducts.map(product => product.category)))];

const XstoreFresh = () => {
  const { cart, addToCart } = useCart();
  const { currentCity } = useCity();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [showHotDealsOnly, setShowHotDealsOnly] = useState(false);
  
  // Filter products based on search, category, and hot deals
  const filteredProducts = mockFreshProducts
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
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-xstore-green to-xstore-green-light text-white py-12">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <div className="flex items-center gap-2 mb-4">
                <Leaf size={24} />
                <h2 className="text-lg font-medium">Xstore Fresh</h2>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Fresh Produce Delivered Daily
              </h1>
              <p className="text-lg mb-6">
                Source the freshest fruits, vegetables, and ingredients for your restaurant or hotel directly from local mandis.
              </p>
            </div>
            <div className="md:w-1/2 md:pl-12">
              <img 
                src="https://images.unsplash.com/photo-1721322800607-8c38375eef04" 
                alt="Fresh produce" 
                className="rounded-lg shadow-lg" 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Fresh Products in {currentCity}</h1>
            <p className="text-gray-600 mt-1">Sourced directly from local mandis</p>
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
                placeholder="Search fresh products..."
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

export default XstoreFresh;
