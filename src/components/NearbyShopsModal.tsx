import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, MapPin, Clock } from 'lucide-react';
import { getNearbyShopsForProducts, NearbyShop } from '@/services/nearbyShopsService';
import { useCart } from '@/context/CartContext';
import { useCity } from '@/context/CityContext';

interface NearbyShopsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NearbyShopsModal: React.FC<NearbyShopsModalProps> = ({ isOpen, onClose }) => {
  const { cart } = useCart();
  const { currentCity } = useCity();
  const [nearbyShops, setNearbyShops] = useState<NearbyShop[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && currentCity) {
      fetchNearbyShops();
    }
  }, [isOpen, currentCity]);

  const fetchNearbyShops = async () => {
    if (!currentCity || cart.items.length === 0) return;

    setLoading(true);
    try {
      const productIds = cart.items.map(item => item.product.id);
      const shops = await getNearbyShopsForProducts(currentCity, productIds);
      setNearbyShops(shops);
    } catch (error) {
      console.error('Error fetching nearby shops:', error);
    } finally {
      setLoading(false);
    }
  };

  // Group shops by product
  const shopsByProduct = nearbyShops.reduce((acc, shop) => {
    if (!acc[shop.product_id]) {
      acc[shop.product_id] = {
        product_name: shop.product_name,
        shops: []
      };
    }
    acc[shop.product_id].shops.push(shop);
    return acc;
  }, {} as Record<string, { product_name: string; shops: NearbyShop[] }>);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Recently Bought by These Shops Near You
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X size={16} />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Prices may vary slightly based on shopkeeper margins, but you'll still likely get a better deal than market rates. This is not a direct delivery; you can contact or visit the shop yourself.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-gray-600">Finding nearby shops...</p>
            </div>
          ) : Object.keys(shopsByProduct).length === 0 ? (
            <div className="text-center py-8">
              <MapPin size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">No nearby shops found</h3>
              <p className="text-gray-600">
                No shops in your area have recently purchased these items. Try checking back later or contact us for assistance.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(shopsByProduct).map(([productId, productData]) => (
                <div key={productId} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-blue-500 text-white px-4 py-3">
                    <h3 className="font-medium flex items-center">
                      <span className="w-3 h-3 bg-white rounded-sm mr-3"></span>
                      {productData.product_name}
                    </h3>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Shop Name</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Address</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Landmark</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Purchased</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {productData.shops.map((shop, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {shop.shop_name}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {shop.shop_address}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              <div className="flex items-center">
                                <MapPin size={14} className="mr-1 text-gray-400" />
                                {shop.landmark || 'Not specified'}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Clock size={14} className="mr-1 text-gray-400" />
                                {formatDate(shop.order_date)}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NearbyShopsModal;