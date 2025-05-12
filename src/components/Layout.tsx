
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';

type LayoutProps = {
  children: React.ReactNode;
  cartItemCount?: number;
  currentCity?: string;
  hideFooter?: boolean;
};

const Layout = ({ 
  children, 
  cartItemCount = 0, 
  currentCity = undefined,
  hideFooter = false
}: LayoutProps) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isCitySelect = location.pathname === '/select-city';
  
  // Don't show city selector on city select page or when no city is set yet
  const showCitySelector = !isCitySelect && (!!currentCity || !isHomePage);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar 
        cartItemCount={cartItemCount}
        currentCity={currentCity}
        showCitySelector={showCitySelector}
      />
      <main className="flex-grow">
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default Layout;
