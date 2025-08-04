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
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [email, setEmail] = useState('admin@xstoreindia.shop');
  const [password, setPassword] = useState('Admin123!@#');
  const [otpCode, setOtpCode] = useState('');
  const [showOTPStep, setShowOTPStep] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const [isSetupMode, setIsSetupMode] = useState(false);
  const navigate = useNavigate();

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

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check setup mode
        const adminExists = await checkAdminExists();
        setIsSetupMode(!adminExists);

        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state changed:', event, session?.user?.id);
            setSession(session);
            setUser(session?.user ?? null);
            
            if (session?.user) {
              // Use setTimeout to prevent potential deadlocks
              setTimeout(async () => {
                const isAdmin = await checkIsAdmin(session.user.id);
                
                if (isAdmin) {
                  console.log('User is admin, calling onAuthSuccess');
                  onAuthSuccess();
                } else if (!isSetupMode) {
                  toast({
                    title: "Access Denied",
                    description: "You don't have admin privileges",
                    variant: "destructive"
                  });
                  await supabase.auth.signOut();
                } else {
                  // First time setup - auto-promote
                  const { error: insertError } = await supabase
                    .from('admin_users')
                    .insert({
                      user_id: session.user.id,
                      email: session.user.email || '',
                      role: 'admin'
                    });
                  
                  if (!insertError) {
                    toast({
                      title: "Admin Account Created",
                      description: "You are now the admin of this system",
                    });
                    onAuthSuccess();
                  } else {
                    console.error('Error creating admin user:', insertError);
                    toast({
                      title: "Setup Error",
                      description: "Failed to create admin account",
                      variant: "destructive"
                    });
                  }
                }
              }, 100);
            }
            setIsLoading(false);
          }
        );

        // Check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          console.log('Existing session found:', session.user.id);
          setSession(session);
          setUser(session.user);
          
          const isAdmin = await checkIsAdmin(session.user.id);
          if (isAdmin) {
            onAuthSuccess();
          } else if (isSetupMode) {
            // Auto-promote during setup
            const { error: insertError } = await supabase
              .from('admin_users')
              .insert({
                user_id: session.user.id,
                email: session.user.email || '',
                role: 'admin'
              });
            
            if (!insertError) {
              onAuthSuccess();
            }
          } else {
            await supabase.auth.signOut();
          }
        }
        setIsLoading(false);

        return () => subscription.unsubscribe();
      } catch (error) {
        console.error('Error initializing auth:', error);
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [onAuthSuccess, isSetupMode]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSigningIn(true);

    try {
      // Clean up any existing state
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
        toast({
          title: "Sign In Failed",
          description: error.message,
          variant: "destructive"
        });
      } else if (data.user) {
        toast({
          title: "Signed In Successfully",
          description: "Verifying admin privileges...",
        });
      }
    } catch (error: any) {
      toast({
        title: "An error occurred",
        description: error.message || "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingOTP(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-admin-otp', {
        body: { requestedEmail: email }
      });

      if (error) {
        toast({
          title: "Failed to Send OTP",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      setPendingEmail(email);
      setShowOTPStep(true);
      toast({
        title: "OTP Sent",
        description: "Verification code sent to sativinay21@gmail.com",
      });
    } catch (error: any) {
      toast({
        title: "An error occurred",
        description: error.message || "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleVerifyOTPAndCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifyingOTP(true);
    
    try {
      // Step 1: Verify OTP
      const { data: otpData, error: otpError } = await supabase.functions.invoke('verify-admin-otp', {
        body: { email: pendingEmail, otpCode }
      });

      if (otpError || !otpData?.success) {
        toast({
          title: "Invalid OTP",
          description: "Please check the OTP code and try again",
          variant: "destructive"
        });
        return;
      }

      // Step 2: Clean auth state and create account
      cleanupAuthState();
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }

      // Step 3: Create Supabase Auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: pendingEmail,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin`,
          data: {
            email_confirm: true
          }
        }
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          toast({
            title: "Account Already Exists",
            description: "Please use the Sign In tab to login",
            variant: "destructive"
          });
          setShowOTPStep(false);
          setOtpCode('');
          setPendingEmail('');
          return;
        }
        
        toast({
          title: "Failed to Create Account",
          description: authError.message,
          variant: "destructive"
        });
        return;
      }

      if (authData.user) {
        // Step 4: Create admin user entry
        const { error: adminError } = await supabase
          .from('admin_users')
          .insert({
            user_id: authData.user.id,
            email: pendingEmail,
            role: 'admin'
          });

        if (adminError) {
          console.error("Error creating admin user:", adminError);
          toast({
            title: "Admin Setup Error",
            description: "Account created but admin privileges not assigned. Please contact support.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Admin Account Created Successfully",
            description: "You can now sign in with your credentials",
          });
          
          // Reset form and switch to sign in
          setShowOTPStep(false);
          setOtpCode('');
          setPendingEmail('');
          setEmail(pendingEmail);
        }
      }
    } catch (error: any) {
      console.error("Account creation error:", error);
      toast({
        title: "An error occurred",
        description: error.message || "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  const resetOTPFlow = () => {
    setShowOTPStep(false);
    setOtpCode('');
    setPendingEmail('');
  };


  const handleSignOut = async () => {
    cleanupAuthState();
    await supabase.auth.signOut({ scope: 'global' });
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
          <CardTitle className="text-2xl">
            {isSetupMode ? "Admin Setup" : "Admin Access"}
          </CardTitle>
          <CardDescription>
            {isSetupMode 
              ? "Create the first admin account to secure your system" 
              : "Secure authentication required for admin panel"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">
                {isSetupMode ? "Setup Admin" : "Sign Up"}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@xstoreindia.shop"
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
            </TabsContent>
            
            <TabsContent value="signup">
              {!showOTPStep ? (
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div>
                    <Label htmlFor="signup-email">Admin Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Enter admin email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Choose a strong password"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSendingOTP}
                  >
                    {isSendingOTP ? "Sending OTP..." : "Request Admin Access"}
                  </Button>
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      🔐 <strong>Security Notice:</strong> An OTP will be sent to sativinay21@gmail.com for verification
                    </p>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold">OTP Verification Required</h3>
                    <p className="text-sm text-muted-foreground">
                      OTP has been sent to sativinay21@gmail.com for: <strong>{pendingEmail}</strong>
                    </p>
                  </div>
                  <form onSubmit={handleVerifyOTPAndCreateAccount} className="space-y-4">
                    <div>
                      <Label htmlFor="otp-code">Enter OTP Code</Label>
                      <Input
                        id="otp-code"
                        type="text"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        required
                        placeholder="Enter 6-digit code"
                        maxLength={6}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        type="submit" 
                        className="flex-1"
                        disabled={isVerifyingOTP || otpCode.length !== 6}
                      >
                        {isVerifyingOTP ? "Verifying..." : "Verify & Create Admin"}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={resetOTPFlow}
                        disabled={isVerifyingOTP}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                  <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                    <p className="text-sm text-amber-700">
                      ⏰ OTP expires in 10 minutes. Check sativinay21@gmail.com for the verification code.
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          <div className="mt-4 text-center text-sm text-muted-foreground">
            {isSetupMode 
              ? "Admin creation requires OTP verification from authorized personnel"
              : "Only authorized administrators can access this panel"
            }
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAuth;