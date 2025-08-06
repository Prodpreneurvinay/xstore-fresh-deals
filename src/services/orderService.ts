import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { CartItem } from "@/context/CartContext";

export interface Order {
  id: string;
  shop_name: string;
  phone_number: string;
  address: string;
  landmark?: string;
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
  product_name: string;
  product_image?: string;
  product_category?: string;
  product?: {
    name: string;
    image_url: string;
  };
}

// Create a new order - simplified version
export const createOrder = async (orderData: {
  shop_name: string;
  phone_number: string;
  address: string;
  landmark: string;
  city: string;
  total: number;
  items: CartItem[];
}): Promise<Order | null> => {
  try {
    console.log("Starting order creation with data:", orderData);
    console.log("Cart items:", orderData.items);

    // Validate required fields
    if (!orderData.shop_name || !orderData.phone_number || !orderData.address || !orderData.city) {
      throw new Error("Missing required order information");
    }

    if (!orderData.items || orderData.items.length === 0) {
      throw new Error("No items in order");
    }

    // Validate each item has required properties
    for (const item of orderData.items) {
      if (!item.product || !item.product.id || !item.product.name || typeof item.product.sellingPrice !== 'number') {
        console.error("Invalid item data:", item);
        throw new Error("Invalid product data in cart items");
      }
      if (!item.quantity || item.quantity <= 0) {
        console.error("Invalid quantity for item:", item);
        throw new Error("Invalid quantity in cart items");
      }
    }

    // Insert the order first
    const orderInsert = {
      shop_name: orderData.shop_name,
      phone_number: orderData.phone_number,
      address: orderData.address,
      landmark: orderData.landmark || "",
      city: orderData.city,
      total: Number(orderData.total),
      status: 'pending'
    };

    console.log("Inserting order:", orderInsert);

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderInsert)
      .select()
      .single();

    if (orderError) {
      console.error("Order creation error:", orderError);
      throw orderError;
    }

    if (!order) {
      throw new Error("No order returned from database");
    }

    console.log("Order created successfully:", order);

    // Insert order items
    const orderItems = orderData.items.map(item => {
      const orderItem = {
        order_id: order.id,
        product_id: item.product.id,
        quantity: Number(item.quantity),
        price: Number(item.product.sellingPrice),
        product_name: item.product.name,
        product_image: item.product.imageUrl || "",
        product_category: item.product.category || ""
      };
      console.log("Mapping order item:", orderItem);
      return orderItem;
    });

    console.log("Inserting order items:", orderItems);

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error("Order items creation error:", itemsError);
      // Try to delete the order if items failed
      await supabase.from('orders').delete().eq('id', order.id);
      throw itemsError;
    }

    console.log("Order and items created successfully");

    toast({
      title: "Order placed successfully",
      description: "Your order has been received and will be processed soon.",
    });

    return order;

  } catch (error: any) {
    console.error("Error in createOrder:", error);
    console.error("Error details:", {
      message: error?.message,
      code: error?.code,
      details: error?.details,
      hint: error?.hint,
      stack: error?.stack
    });
    
    let errorMessage = "An unexpected error occurred while placing your order.";
    
    if (error?.message) {
      if (error.message.includes("Invalid product data")) {
        errorMessage = "Some items in your cart have invalid data. Please refresh the page and try again.";
      } else if (error.message.includes("Invalid quantity")) {
        errorMessage = "Some items in your cart have invalid quantities. Please check your cart and try again.";
      } else if (error.message.includes("Missing required order information")) {
        errorMessage = "Please fill in all required fields.";
      } else if (error.message.includes("No items in order")) {
        errorMessage = "Your cart is empty. Please add items before placing an order.";
      } else {
        errorMessage = error.message;
      }
    }
    
    toast({
      title: "Order failed",
      description: errorMessage,
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
      return [];
    }

    if (!orders || orders.length === 0) {
      return [];
    }

    // Get order items for all orders
    const orderIds = orders.map(order => order.id);
    
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select(`
        id, 
        order_id, 
        product_id, 
        quantity, 
        price, 
        created_at,
        product_name,
        product_image,
        product_category
      `)
      .in('order_id', orderIds);

    if (itemsError) {
      console.error("Error fetching order items:", itemsError);
      return orders;
    }

    // Add items to their respective orders
    const ordersWithItems = orders.map(order => {
      const items = orderItems?.filter(item => item.order_id === order.id) || [];
      return {
        ...order,
        items
      };
    });

    return ordersWithItems;
  } catch (error) {
    console.error("Error in getOrders:", error);
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