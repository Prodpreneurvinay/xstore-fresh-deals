import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface AdminAuthState {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;
  isSetupMode: boolean;
}

export const useAdminAuth = () => {
  const [authState, setAuthState] = useState<AdminAuthState>({
    user: null,
    session: null,
    isAdmin: false,
    isLoading: true,
    isSetupMode: false,
  });

  // Clean up auth state utility
  const cleanupAuthState = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  };

  // Check if any admin users exist
  const checkAdminExists = async () => {
    try {
      const { data: existingAdmins, error } = await supabase
        .from('admin_users')
        .select('*')
        .limit(1);
      
      if (error) {
        console.error('Error checking admin users:', error);
        return false;
      }
      
      return existingAdmins && existingAdmins.length > 0;
    } catch (error) {
      console.error('Error in checkAdminExists:', error);
      return false;
    }
  };

  // Check if current user is admin
  const checkIsAdmin = async (userId: string) => {
    try {
      const { data: adminUser, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
      
      return !!adminUser;
    } catch (error) {
      console.error('Error in checkIsAdmin:', error);
      return false;
    }
  };

  // Create first admin user using the safe function
  const createFirstAdminUser = async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase.rpc('create_first_admin', {
        target_email: email,
        target_user_id: userId
      });

      if (error) {
        console.error('Error creating first admin:', error);
        throw error;
      }

      return true;
    } catch (error: any) {
      console.error('Error in createFirstAdminUser:', error);
      throw error;
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check setup mode
        const adminExists = await checkAdminExists();
        
        setAuthState(prev => ({
          ...prev,
          isSetupMode: !adminExists
        }));

        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state changed:', event, session?.user?.id);
            
            setAuthState(prev => ({
              ...prev,
              session,
              user: session?.user ?? null,
            }));
            
            if (session?.user) {
              // Use setTimeout to prevent potential deadlocks
              setTimeout(async () => {
                try {
                  const currentAdminExists = await checkAdminExists();
                  
                  if (!currentAdminExists) {
                    // First time setup - create the first admin
                    await createFirstAdminUser(session.user.id, session.user.email || '');
                    
                    setAuthState(prev => ({
                      ...prev,
                      isAdmin: true,
                      isLoading: false,
                      isSetupMode: false
                    }));
                    
                    toast({
                      title: "Admin Account Created",
                      description: "You are now the admin of this system",
                    });
                  } else {
                    // Check if this user is an admin
                    const isAdmin = await checkIsAdmin(session.user.id);
                    
                    setAuthState(prev => ({
                      ...prev,
                      isAdmin,
                      isLoading: false
                    }));
                    
                    if (!isAdmin) {
                      toast({
                        title: "Access Denied",
                        description: "You don't have admin privileges",
                        variant: "destructive"
                      });
                      await supabase.auth.signOut();
                    }
                  }
                } catch (error: any) {
                  console.error('Error in auth state change handler:', error);
                  setAuthState(prev => ({
                    ...prev,
                    isLoading: false
                  }));
                  
                  toast({
                    title: "Authentication Error",
                    description: error.message || "Failed to verify admin status",
                    variant: "destructive"
                  });
                }
              }, 100);
            } else {
              setAuthState(prev => ({
                ...prev,
                isAdmin: false,
                isLoading: false
              }));
            }
          }
        );

        // Check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          console.log('Existing session found:', session.user.id);
          
          const currentAdminExists = await checkAdminExists();
          
          if (!currentAdminExists) {
            // Auto-create first admin
            await createFirstAdminUser(session.user.id, session.user.email || '');
            
            setAuthState({
              user: session.user,
              session,
              isAdmin: true,
              isLoading: false,
              isSetupMode: false
            });
          } else {
            const isAdmin = await checkIsAdmin(session.user.id);
            
            setAuthState({
              user: session.user,
              session,
              isAdmin,
              isLoading: false,
              isSetupMode: !currentAdminExists
            });
            
            if (!isAdmin) {
              await supabase.auth.signOut();
            }
          }
        } else {
          setAuthState(prev => ({
            ...prev,
            isLoading: false
          }));
        }

        return () => subscription.unsubscribe();
      } catch (error) {
        console.error('Error initializing auth:', error);
        setAuthState(prev => ({
          ...prev,
          isLoading: false
        }));
      }
    };

    initializeAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      cleanupAuthState();
      
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      cleanupAuthState();
      await supabase.auth.signOut({ scope: 'global' });
      
      setAuthState({
        user: null,
        session: null,
        isAdmin: false,
        isLoading: false,
        isSetupMode: false
      });
      
      toast({
        title: "Signed out successfully",
        description: "You have been securely logged out",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Sign out error",
        description: "There was an issue signing out",
        variant: "destructive"
      });
    }
  };

  return {
    ...authState,
    signIn,
    signOut,
    cleanupAuthState
  };
};