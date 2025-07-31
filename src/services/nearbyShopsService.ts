import { supabase } from '@/integrations/supabase/client';

export interface NearbyShop {
  product_id: string;
  product_name: string;
  shop_name: string;
  shop_address: string;
  shop_city: string;
  landmark: string;
  order_date: string;
}

export const getNearbyShopsForProducts = async (
  userCity: string,
  productIds: string[]
): Promise<NearbyShop[]> => {
  try {
    const { data, error } = await supabase.rpc('get_nearby_shops_for_products', {
      user_city: userCity,
      product_ids: productIds
    });

    if (error) {
      console.error('Error fetching nearby shops:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching nearby shops:', error);
    return [];
  }
};