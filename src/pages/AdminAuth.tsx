import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { Lock, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AdminAuthProps {
  onAuthSuccess: () => void;
}

const AdminAuth = ({ onAuthSuccess }: AdminAuthProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Check authentication state and admin status
  useEffect(() => {
    const initializeAuth = async () => {
      // Set up auth state listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            // Check if user is admin
            const { data: adminUser, error } = await supabase
              .from('admin_users')
              .select('*')
              .eq('user_id', session.user.id)
              .single();
            
            if (adminUser && !error) {
              onAuthSuccess();
            } else {
              toast({
                title: "Access Denied",
                description: "You don't have admin privileges",
                variant: "destructive"
              });
              await supabase.auth.signOut();
            }
          }
          setIsLoading(false);
        }
      );

      // Check for existing session
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setSession(session);
        setUser(session.user);
        
        const { data: adminUser, error } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        
        if (adminUser && !error) {
          onAuthSuccess();
        } else {
          await supabase.auth.signOut();
        }
      }
      setIsLoading(false);

      return () => subscription.unsubscribe();
    };

    initializeAuth();
  }, [onAuthSuccess]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSigningIn(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Sign In Failed",
          description: error.message,
          variant: "destructive"
        });
      } else if (data.user) {
        // Check admin status will be handled by onAuthStateChange
        toast({
          title: "Signed In Successfully",
          description: "Verifying admin privileges...",
        });
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsSigningIn(false);
    }
  };


  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p>Verifying access...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return null; // User is authenticated and authorized
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 mx-auto">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Admin Access</CardTitle>
          <CardDescription>
            Secure authentication required for admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSigningIn}
            >
              {isSigningIn ? "Signing In..." : "Admin Sign In"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Only authorized administrators can access this panel
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAuth;