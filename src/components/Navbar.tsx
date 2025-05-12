
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

type NavbarProps = {
  cartItemCount?: number;
  currentCity?: string;
  showCitySelector?: boolean;
};

const Navbar = ({ cartItemCount = 0, currentCity, showCitySelector = true }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container-custom flex justify-between items-center py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-xstore-green">X</span>
            <span className="text-2xl font-bold">store</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {showCitySelector && (
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-1">Delivering to:</span>
              <Link 
                to="/select-city" 
                className="text-sm font-medium flex items-center hover:text-xstore-green"
              >
                {currentCity || 'Select City'}
                <ChevronDown size={16} className="ml-1" />
              </Link>
            </div>
          )}
          <nav className="flex items-center gap-6">
            <Link to="/products" className="hover:text-xstore-green">Products</Link>
            <Link to="/xstore-fresh" className="hover:text-xstore-green">Xstore Fresh</Link>
          </nav>
          <Link to="/cart" className="relative">
            <Button variant="ghost" className="relative p-2">
              <ShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-xstore-orange text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </Link>
        </div>

        {/* Mobile Nav Button */}
        <div className="md:hidden flex items-center gap-3">
          <Link to="/cart" className="relative">
            <Button variant="ghost" className="relative p-2">
              <ShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-xstore-orange text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            className="p-2" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md py-4">
          <div className="container-custom space-y-4">
            <nav className="flex flex-col gap-4">
              <Link 
                to="/products" 
                className="py-2 hover:text-xstore-green"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link 
                to="/xstore-fresh" 
                className="py-2 hover:text-xstore-green"
                onClick={() => setIsMenuOpen(false)}
              >
                Xstore Fresh
              </Link>
            </nav>
            {showCitySelector && (
              <div className="pt-4 border-t border-gray-100">
                <Link 
                  to="/select-city" 
                  className="flex items-center text-sm py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-gray-500 mr-2">Delivering to:</span>
                  <span className="font-medium">{currentCity || 'Select City'}</span>
                  <ChevronDown size={16} className="ml-1" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
