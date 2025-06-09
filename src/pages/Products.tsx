import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import ProductCard, { Product } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useCity } from '@/context/CityContext';
import { Filter, Search, ShoppingCart, TrendingUp, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '@/services/productService';
import { useToast } from '@/components/ui/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import CategoryCard from '@/components/CategoryCard';

const Products = () => {
  const { cart, addToCart } = useCart();
  const { currentCity } = useCity();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Hot Deals'); // Default to Hot Deals
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['Hot Deals', 'All Products']);
  const [showAllProducts, setShowAllProducts] = useState(false);
  
  // These categories are considered retail (Xstore) categories
  const RETAIL_CATEGORIES = ['Personal Care', 'Food Items', 'Beverages', 'Home Care', 'Health and Hygiene'];
  
  // Check if city is selected, redirect if not
  useEffect(() => {
    if (!currentCity) {
      toast({
        title: "City Required",
        description: "Please select your city to see available products",
        variant: "default"
      });
      navigate('/select-city');
    }
  }, [currentCity, navigate, toast]);
  
  // Fetch products when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      if (!currentCity) return;
      
      setLoading(true);
      try {
        const fetchedProducts = await getProducts();
        
        // Filter to only include retail products (FMCG items)
        const retailProducts = fetchedProducts.filter(
          product => RETAIL_CATEGORIES.includes(product.category)
        );
        
        setProducts(retailProducts);
        
        // Extract unique categories and add Hot Deals at the beginning
        const uniqueCategories = ['Hot Deals', 'All Products', ...Array.from(new Set(retailProducts.map(product => product.category)))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast({
          title: "Failed to fetch products",
          description: "Please check your connection and try again",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [currentCity, toast]);
  
  // Filter products based on search, category, and city
  const filteredProducts = products
    .filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(product => {
      if (selectedCategory === 'Hot Deals') {
        return product.isHotDeal;
      }
      if (selectedCategory === 'All Products') {
        return true;
      }
      return product.category === selectedCategory;
    })
    .filter(product => !currentCity || !product.cities || product.cities.includes(currentCity));

  // Get hot deals products for the main display
  const hotDealsProducts = products
    .filter(product => product.isHotDeal)
    .filter(product => !currentCity || !product.cities || product.cities.includes(currentCity))
    .filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Get all products for browse all section
  const allProducts = products
    .filter(product => !currentCity || !product.cities || product.cities.includes(currentCity))
    .filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Handle view cart click
  const handleViewCart = () => {
    navigate('/cart');
  };

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    if (category === 'All Products') {
      setShowAllProducts(true);
    }
  };

  // Handle browse all products
  const handleBrowseAllProducts = () => {
    setSelectedCategory('All Products');
    setShowAllProducts(true);
  };
  
  // If no city is selected, we return null since the useEffect will handle redirection
  if (!currentCity) {
    return null;
  }
  
  return (
    <Layout cartItemCount={cart.itemCount} currentCity={currentCity}>
      <div className="container-custom py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
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

        {/* Search Bar - Moved to top */}
        <div className="relative mb-6">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Category Visual Bar with horizontal scroll */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Categories</h2>
          <div className="overflow-x-auto">
            <div className="flex gap-4 pb-4 min-w-max">
              {categories.map((category) => (
                <CategoryCard 
                  key={category}
                  category={category}
                  isSelected={selectedCategory === category}
                  onClick={() => handleCategorySelect(category)}
                />
              ))}
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-xstore-green" />
          </div>
        ) : (
          <>
            {/* Hot Deals Section - Default view */}
            {selectedCategory === 'Hot Deals' && (
              <div className="mb-8">
                <div className="flex items-center mb-6">
                  <TrendingUp size={24} className="text-xstore-orange mr-2" />
                  <h2 className="text-2xl font-semibold">Hot Deals</h2>
                </div>
                
                {hotDealsProducts.length === 0 ? (
                  <div className="text-center py-16">
                    <h3 className="text-xl font-medium text-gray-600">No hot deals found</h3>
                    <p className="mt-2 text-gray-500">Try adjusting your search or check back later</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
                      {hotDealsProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onAddToCart={addToCart}
                        />
                      ))}
                    </div>
                    
                    {/* Browse All Products Button */}
                    <div className="text-center py-8 border-t border-gray-200">
                      <h3 className="text-xl font-medium text-gray-800 mb-4">
                        Want to see more products?
                      </h3>
                      <Button 
                        onClick={handleBrowseAllProducts}
                        className="bg-xstore-green hover:bg-xstore-green-dark"
                      >
                        Browse All Products
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Other Categories or All Products */}
            {selectedCategory !== 'Hot Deals' && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-6">
                  {selectedCategory === 'All Products' ? 'All Products' : selectedCategory}
                </h2>
                
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
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Products;
