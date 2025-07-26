import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

// Check if current user is admin
export const checkAdminStatus = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return false;
    }

    const { data: adminUser, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error || !adminUser) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

// Add user to admin_users table
export const promoteToAdmin = async (userId: string, email: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('admin_users')
      .insert({
        user_id: userId,
        email: email,
        role: 'admin'
      });

    if (error) {
      console.error("Error promoting user to admin:", error);
      toast({
        title: "Failed to promote user",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }

    toast({
      title: "User promoted successfully",
      description: `${email} is now an admin`,
    });
    return true;
  } catch (error) {
    console.error("Error in promoteToAdmin:", error);
    toast({
      title: "An unexpected error occurred",
      description: "Could not promote user to admin",
      variant: "destructive"
    });
    return false;
  }
};

// Remove user from admin_users table
export const removeAdmin = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('admin_users')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error("Error removing admin:", error);
      toast({
        title: "Failed to remove admin",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }

    toast({
      title: "Admin removed successfully",
      description: "User no longer has admin privileges",
    });
    return true;
  } catch (error) {
    console.error("Error in removeAdmin:", error);
    toast({
      title: "An unexpected error occurred",
      description: "Could not remove admin privileges",
      variant: "destructive"
    });
    return false;
  }
};

// Get all admin users
export const getAdminUsers = async (): Promise<AdminUser[]> => {
  try {
    const { data: adminUsers, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching admin users:", error);
      toast({
        title: "Failed to fetch admin users",
        description: error.message,
        variant: "destructive"
      });
      return [];
    }

    return adminUsers || [];
  } catch (error) {
    console.error("Error in getAdminUsers:", error);
    toast({
      title: "An unexpected error occurred",
      description: "Could not fetch admin users",
      variant: "destructive"
    });
    return [];
  }
};

// Secure admin sign out
export const adminSignOut = async (): Promise<void> => {
  try {
    await supabase.auth.signOut();
    // Clear any admin-related localStorage
    Object.keys(localStorage).forEach(key => {
      if (key.includes('admin') || key.includes('xstore')) {
        localStorage.removeItem(key);
      }
    });
    
    toast({
      title: "Signed out successfully",
      description: "You have been securely logged out",
    });
  } catch (error) {
    console.error("Error signing out:", error);
    toast({
      title: "Sign out error",
      description: "There was an issue signing out",
      variant: "destructive"
    });
  }
};