
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Providers
import { CartProvider } from "./context/CartContext";
import { CityProvider } from "./context/CityContext";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SelectCity from "./pages/SelectCity";
import Products from "./pages/Products";
import XstoreFresh from "./pages/XstoreFresh";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import AdminDashboard from "./pages/Admin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <CityProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/select-city" element={<SelectCity />} />
              <Route path="/products" element={<Products />} />
              <Route path="/xstore-fresh" element={<XstoreFresh />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CityProvider>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
