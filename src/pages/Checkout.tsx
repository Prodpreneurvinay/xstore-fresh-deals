
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { MapPin } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useCity } from '@/context/CityContext';
import { createOrder } from '@/services/orderService';

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { currentCity } = useCity();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    shopName: '',
    phoneNumber: '',
    address: '',
    landmark: '',
    isExistingCustomer: false,
    existingPhoneNumber: '',
  });
  
  const [isExistingPhoneVerified, setIsExistingPhoneVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Redirect to city selection if no city is selected
  if (!currentCity) {
    navigate('/select-city');
    return null;
  }
  
  // Return to products if cart is empty
  if (cart.items.length === 0) {
    navigate('/products');
    return null;
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ 
      ...prev, 
      isExistingCustomer: checked,
      // Reset these fields when toggling
      existingPhoneNumber: '',
      address: checked ? '' : prev.address,
    }));
    setIsExistingPhoneVerified(false);
  };
  
  // Mock function to verify existing phone
  const handleVerifyPhone = () => {
    // In a real app, this would call an API
    const mockData = {
      exists: true,
      shopName: "ABC General Store",
      address: "123 Market Street, Andheri East, Mumbai - 400069",
    };
    
    if (formData.existingPhoneNumber.length === 10) {
      setIsExistingPhoneVerified(true);
      setFormData((prev) => ({ 
        ...prev,
        shopName: mockData.shopName,
        address: mockData.address,
        phoneNumber: formData.existingPhoneNumber
      }));
      
      toast({
        title: "Customer found",
        description: "We've filled your details automatically.",
      });
    } else {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid 10-digit phone number.",
        variant: "destructive"
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.shopName || !formData.phoneNumber || !formData.address || !formData.landmark) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields including landmark.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create an order in the database
      const order = await createOrder({
        shop_name: formData.shopName,
        phone_number: formData.phoneNumber,
        address: formData.address,
        landmark: formData.landmark,
        city: currentCity,
        total: cart.total,
        items: cart.items
      });
      
      if (order) {
        // Clear the cart and navigate to success page
        clearCart();
        navigate('/order-success');
      } else {
        toast({
          title: "Order failed",
          description: "There was an error placing your order. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        title: "Order failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Layout cartItemCount={cart.itemCount} currentCity={currentCity}>
      <div className="container-custom py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Checkout Form */}
          <div className="flex-grow">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Delivery Information</h2>
              
              {/* Existing Customer Toggle */}
              <div className="mb-6">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="isExistingCustomer" 
                    checked={formData.isExistingCustomer}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <label
                    htmlFor="isExistingCustomer"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I'm an existing customer
                  </label>
                </div>
              </div>
              
              {/* Existing Customer Form */}
              {formData.isExistingCustomer && (
                <div className="p-4 border border-gray-200 rounded-md mb-6">
                  <div className="mb-4">
                    <label htmlFor="existingPhoneNumber" className="block text-sm font-medium mb-1">
                      Phone Number
                    </label>
                    <div className="flex gap-2">
                      <Input
                        type="tel"
                        id="existingPhoneNumber"
                        name="existingPhoneNumber"
                        placeholder="Enter your registered phone number"
                        value={formData.existingPhoneNumber}
                        onChange={handleInputChange}
                        className="flex-grow"
                        maxLength={10}
                        disabled={isExistingPhoneVerified}
                      />
                      <Button 
                        type="button" 
                        onClick={handleVerifyPhone}
                        disabled={isExistingPhoneVerified}
                        variant={isExistingPhoneVerified ? "outline" : "default"}
                        className={isExistingPhoneVerified ? "border-green-500 text-green-500" : ""}
                      >
                        {isExistingPhoneVerified ? "Verified" : "Verify"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* New/Verified Customer Form */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="shopName" className="block text-sm font-medium mb-1">
                    Shop / Restaurant Name*
                  </label>
                  <Input
                    type="text"
                    id="shopName"
                    name="shopName"
                    placeholder="Enter your shop or restaurant name"
                    value={formData.shopName}
                    onChange={handleInputChange}
                    disabled={formData.isExistingCustomer && isExistingPhoneVerified}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium mb-1">
                    Phone Number*
                  </label>
                  <Input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="Enter your phone number"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    disabled={formData.isExistingCustomer && isExistingPhoneVerified}
                    required
                    maxLength={10}
                  />
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium mb-1">
                    Delivery Address*
                  </label>
                  <Textarea
                    id="address"
                    name="address"
                    placeholder="Enter your complete delivery address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    disabled={formData.isExistingCustomer && isExistingPhoneVerified}
                    rows={3}
                  />
                </div>

                <div>
                  <label htmlFor="landmark" className="block text-sm font-medium mb-1">
                    Nearby Landmark*
                  </label>
                  <Input
                    type="text"
                    id="landmark"
                    name="landmark"
                    placeholder="e.g., Near Post Office, Opposite SBI Bank"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    required
                    disabled={formData.isExistingCustomer && isExistingPhoneVerified}
                  />
                </div>
                
                <Button type="button" variant="outline" className="w-full flex items-center justify-center gap-2 border-dashed">
                  <MapPin size={16} />
                  Use My Current Location
                </Button>
              </div>
              
              <div className="mt-8">
                <Button 
                  type="submit" 
                  className="w-full bg-xstore-green"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Placing Order..." : "Place Order"}
                </Button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  No payment required - pay on delivery
                </p>
              </div>
            </form>
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-96">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                {cart.items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      <img 
                        src={item.product.imageUrl} 
                        alt={item.product.name}
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-medium line-clamp-1">{item.product.name}</h4>
                      <div className="text-sm text-gray-500">
                        {item.quantity} x ₹{item.product.sellingPrice.toFixed(2)}
                      </div>
                      <div className="text-sm font-medium">
                        ₹{(item.product.sellingPrice * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-100 mt-4 pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{cart.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600">Delivery</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between py-2 border-t border-gray-100 font-semibold">
                  <span>Total</span>
                  <span>₹{cart.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
