
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { CartItem } from "@/context/CartContext";

export interface Order {
  id: string;
  shop_name: string;
  phone_number: string;
  address: string;
  city: string;
  total: number;
  status: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at: string;
  product_name?: string;  // Added this field for easier access
  product_image?: string; // Added this field for easier access
  product?: {
    name: string;
    image_url: string;
  };
}

// Create a new order
export const createOrder = async (orderData: {
  shop_name: string;
  phone_number: string;
  address: string;
  city: string;
  total: number;
  items: CartItem[];
}): Promise<Order | null> => {
  try {
    // Insert the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        shop_name: orderData.shop_name,
        phone_number: orderData.phone_number,
        address: orderData.address,
        city: orderData.city,
        total: orderData.total
      })
      .select()
      .single();

    if (orderError) {
      console.error("Error creating order:", orderError);
      toast({
        title: "Failed to create order",
        description: orderError.message,
        variant: "destructive"
      });
      return null;
    }

    // Insert order items
    const orderItems = orderData.items.map(item => ({
      order_id: order.id,
      product_id: item.product.id,
      quantity: item.quantity,
      price: item.product.sellingPrice
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error("Error creating order items:", itemsError);
      toast({
        title: "Failed to create order items",
        description: itemsError.message,
        variant: "destructive"
      });
      return null;
    }

    return order;
  } catch (error) {
    console.error("Error in createOrder:", error);
    toast({
      title: "An unexpected error occurred",
      description: "Could not create your order",
      variant: "destructive"
    });
    return null;
  }
};

// Get all orders with their items
export const getOrders = async (): Promise<Order[]> => {
  try {
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (ordersError) {
      console.error("Error fetching orders:", ordersError);
      toast({
        title: "Failed to fetch orders",
        description: ordersError.message,
        variant: "destructive"
      });
      return [];
    }

    // Get order items for all orders
    const orderIds = orders.map(order => order.id);
    
    if (orderIds.length === 0) {
      return orders;
    }

    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select(`
        id, 
        order_id, 
        product_id, 
        quantity, 
        price, 
        created_at,
        products (
          name, 
          image_url
        )
      `)
      .in('order_id', orderIds);

    if (itemsError) {
      console.error("Error fetching order items:", itemsError);
      return orders;
    }

    // Process the items to extract product data
    const processedItems = orderItems.map(item => {
      // Ensure we have direct access to product name and image
      return {
        ...item,
        product_name: item.products?.name || "Unknown Product",
        product_image: item.products?.image_url || ""
      };
    });

    console.log("Processed order items:", processedItems);

    // Add processed items to their respective orders
    const ordersWithItems = orders.map(order => {
      const items = processedItems.filter(item => item.order_id === order.id);
      return {
        ...order,
        items
      };
    });

    return ordersWithItems;
  } catch (error) {
    console.error("Error in getOrders:", error);
    toast({
      title: "An unexpected error occurred",
      description: "Could not fetch orders",
      variant: "destructive"
    });
    return [];
  }
};

// Update order status
export const updateOrderStatus = async (orderId: string, status: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    if (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Failed to update order",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in updateOrderStatus:", error);
    toast({
      title: "An unexpected error occurred",
      description: "Could not update order status",
      variant: "destructive"
    });
    return false;
  }
};
