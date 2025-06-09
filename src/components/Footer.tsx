
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white pt-12 pb-6">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Xstore</h3>
            <p className="text-gray-300 mb-4">
              Connecting wholesalers with local businesses, offering great deals on quality near-expiry products and fresh produce.
            </p>
            <p className="text-gray-300">
              Making supply chains more efficient while reducing waste.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about-us" className="text-gray-300 hover:text-white transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/select-city?service=retail" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/select-city?service=retail" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Xstore Retail
                </Link>
              </li>
              <li>
                <Link to="/select-city?service=fresh" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Xstore Fresh
                </Link>
              </li>
              <li>
                <Link to="/select-city" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Browse by City
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Policies</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <a href="tel:+919876543210" className="text-gray-300 hover:text-white transition-colors duration-200">Call: +91 1334354326</a>
              </li>
              <li>
                <a href="mailto:support@xstore.com" className="text-gray-300 hover:text-white transition-colors duration-200">Email: support@xstoreindia.shop</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6 mt-6 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Xstore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
