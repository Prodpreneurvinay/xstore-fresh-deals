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

// Create a new order - completely rewritten for reliability
export const createOrder = async (orderData: {
  shop_name: string;
  phone_number: string;
  address: string;
  landmark: string;
  city: string;
  total: number;
  items: CartItem[];
}): Promise<Order | null> => {
  console.log("🔄 Starting order creation...");
  console.log("📦 Order data:", orderData);
  console.log("🛒 Cart items:", orderData.items);

  try {
    // Comprehensive validation
    console.log("✅ Step 1: Validating order data...");
    
    if (!orderData.shop_name?.trim()) {
      throw new Error("Shop name is required");
    }
    if (!orderData.phone_number?.trim()) {
      throw new Error("Phone number is required");
    }
    if (!orderData.address?.trim()) {
      throw new Error("Address is required");
    }
    if (!orderData.city?.trim()) {
      throw new Error("City is required");
    }
    if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
      throw new Error("Cart is empty - no items to order");
    }
    if (typeof orderData.total !== 'number' || orderData.total <= 0) {
      throw new Error("Invalid order total");
    }

    // Validate each cart item
    console.log("✅ Step 2: Validating cart items...");
    for (let i = 0; i < orderData.items.length; i++) {
      const item = orderData.items[i];
      console.log(`📋 Validating item ${i + 1}:`, item);
      
      if (!item || typeof item !== 'object') {
        throw new Error(`Cart item ${i + 1} is invalid`);
      }
      if (!item.product || typeof item.product !== 'object') {
        throw new Error(`Product data missing for cart item ${i + 1}`);
      }
      if (!item.product.id) {
        throw new Error(`Product ID missing for cart item ${i + 1}`);
      }
      if (!item.product.name) {
        throw new Error(`Product name missing for cart item ${i + 1}`);
      }
      if (typeof item.product.sellingPrice !== 'number' || item.product.sellingPrice <= 0) {
        throw new Error(`Invalid selling price for ${item.product.name}`);
      }
      if (!item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0) {
        throw new Error(`Invalid quantity for ${item.product.name}`);
      }
    }

    console.log("✅ Step 3: Creating order record...");
    
    // Prepare order data for database (client-generated id to avoid SELECT RLS)
    const orderId = crypto.randomUUID();
    const orderInsert = {
      id: orderId,
      shop_name: orderData.shop_name.trim(),
      phone_number: orderData.phone_number.trim(),
      address: orderData.address.trim(),
      landmark: orderData.landmark?.trim() || null,
      city: orderData.city.trim(),
      total: Number(orderData.total),
      status: 'pending'
    };
    console.log("📝 Inserting order:", orderInsert);

    // Insert the order (no select to bypass SELECT RLS)
    const { error: orderError } = await supabase
      .from('orders')
      .insert(orderInsert);

    if (orderError) {
      console.error("❌ Order creation failed:", orderError);
      throw new Error(`Failed to create order: ${orderError.message}`);
    }

    console.log("✅ Order created successfully with id:", orderId);
    console.log("✅ Step 4: Creating order items...");

    // Prepare order items for database
    const orderItems = orderData.items.map((item, index) => {
      const orderItem = {
        order_id: orderId,
        product_id: item.product.id,
        quantity: Number(item.quantity),
        price: Number(item.product.sellingPrice),
        product_name: item.product.name,
        product_image: item.product.imageUrl || null,
        product_category: item.product.category || null
      };
      console.log(`📦 Order item ${index + 1}:`, orderItem);
      return orderItem;
    });

    console.log("📝 Inserting order items:", orderItems);

    // Insert order items
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error("❌ Order items creation failed:", itemsError);
      
      // Rollback: delete the order if items failed to insert
      console.log("🔄 Rolling back order creation...");
      try {
        await supabase.from('orders').delete().eq('id', orderId);
        console.log("✅ Order rollback successful");
      } catch (rollbackError) {
        console.error("❌ Order rollback failed:", rollbackError);
      }
      
      throw new Error(`Failed to create order items: ${itemsError.message}`);
    }

    console.log("🎉 Order and items created successfully!");

    // Success toast
    toast({
      title: "Order placed successfully! 🎉",
      description: `Your order #${orderId.slice(0, 8)} has been received and will be processed soon.`,
    });

    // Build minimal order object to return (since SELECT is restricted by RLS)
    const minimalOrder: Order = {
      id: orderId,
      shop_name: orderInsert.shop_name,
      phone_number: orderInsert.phone_number,
      address: orderInsert.address,
      landmark: orderInsert.landmark || undefined,
      city: orderInsert.city,
      total: orderInsert.total,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: undefined,
    } as Order;

    return minimalOrder;

  } catch (error: any) {
    console.error("💥 Order creation error:", error);
    console.error("📊 Error details:", {
      message: error?.message,
      code: error?.code,
      details: error?.details,
      hint: error?.hint,
      stack: error?.stack
    });
    
    // Determine user-friendly error message
    let userMessage = "An unexpected error occurred while placing your order.";
    
    if (error?.message) {
      if (error.message.includes("Cart is empty")) {
        userMessage = "Your cart is empty. Please add items before placing an order.";
      } else if (error.message.includes("required")) {
        userMessage = "Please fill in all required fields.";
      } else if (error.message.includes("Invalid")) {
        userMessage = "Some cart data is invalid. Please refresh the page and try again.";
      } else if (error.message.includes("Failed to create")) {
        userMessage = "Failed to save order to database. Please check your connection and try again.";
      } else {
        userMessage = error.message;
      }
    }
    
    // Error toast
    toast({
      title: "Order failed ❌",
      description: userMessage,
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