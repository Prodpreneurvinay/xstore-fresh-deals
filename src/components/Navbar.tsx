
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MapPin, ShoppingCart, Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

type NavbarProps = {
  cartItemCount: number;
  currentCity?: string;
  showCitySelector?: boolean;
};

const Navbar = ({ cartItemCount = 0, currentCity, showCitySelector = true }: NavbarProps) => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-custom py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-xstore-green">X</span>
            <span className="text-2xl font-bold">store</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-xstore-green transition-colors">Home</Link>
            <Link to="/products" className="text-gray-600 hover:text-xstore-green transition-colors">Products</Link>
            <Link to="/xstore-fresh" className="text-gray-600 hover:text-xstore-green transition-colors">XFresh</Link>
            <Link to="/about-us" className="text-gray-600 hover:text-xstore-green transition-colors">About Us</Link>
            <Link to="/contact" className="text-gray-600 hover:text-xstore-green transition-colors">Contact</Link>
          </nav>
          
          {/* Right side: City selector + Cart */}
          <div className="flex items-center gap-2 md:gap-4">
            {showCitySelector && (
              <Link 
                to="/select-city"
                className="flex items-center gap-1 text-gray-700 hover:text-xstore-green text-sm"
              >
                <MapPin size={isMobile ? 18 : 20} />
                <span className="hidden md:inline">{currentCity || "Select City"}</span>
              </Link>
            )}
            
            <Link to="/cart" className="relative">
              <Button 
                variant={isMobile ? "ghost" : "default"} 
                className={isMobile ? "p-1" : ""}
                size={isMobile ? "sm" : "default"}
              >
                <ShoppingCart size={isMobile ? 20 : 20} />
                <span className="hidden md:inline ml-1">Cart</span>
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </Link>
            
            {/* Mobile menu button */}
            <Button 
              variant="ghost"
              size="sm"
              className="md:hidden p-1"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <nav className="md:hidden pt-3 pb-2 border-t mt-3">
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="block px-2 py-1 text-gray-800 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/products" 
                  className="block px-2 py-1 text-gray-800 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Products
                </Link>
              </li>
              <li>
                <Link 
                  to="/xstore-fresh" 
                  className="block px-2 py-1 text-gray-800 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  XFresh
                </Link>
              </li>
              <li>
                <Link 
                  to="/about-us" 
                  className="block px-2 py-1 text-gray-800 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="block px-2 py-1 text-gray-800 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
