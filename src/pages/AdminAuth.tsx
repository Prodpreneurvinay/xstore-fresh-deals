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
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [email, setEmail] = useState('admin@xstoreindia.shop');
  const [password, setPassword] = useState('Admin123!@#');
  const [otpCode, setOtpCode] = useState('');
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [showOTPStep, setShowOTPStep] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const navigate = useNavigate();

  // Check authentication state and admin status
  useEffect(() => {
    const initializeAuth = async () => {
      // Check if any admin users exist
      const { data: existingAdmins } = await supabase
        .from('admin_users')
        .select('*')
        .limit(1);
      
      setIsSetupMode(!existingAdmins || existingAdmins.length === 0);

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
            } else if (!isSetupMode) {
              toast({
                title: "Access Denied",
                description: "You don't have admin privileges",
                variant: "destructive"
              });
              await supabase.auth.signOut();
            } else {
              // First time setup - automatically make this user an admin
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
                toast({
                  title: "Setup Error",
                  description: "Failed to create admin account",
                  variant: "destructive"
                });
              }
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
    };

    initializeAuth();
  }, [onAuthSuccess, isSetupMode]);

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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!showOTPStep) {
      // Step 1: Send OTP to Vinay@pokopop.com
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
          description: "Verification code sent to admin for approval",
        });
      } catch (error) {
        toast({
          title: "An error occurred",
          description: "Please try again",
          variant: "destructive"
        });
      } finally {
        setIsSendingOTP(false);
      }
    } else {
      // Step 2: Verify OTP and create admin account
      setIsVerifyingOTP(true);
      try {
        // First verify the OTP
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

        // OTP verified, now create the Supabase Auth user
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: pendingEmail,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/admin`
          }
        });

        if (authError) {
          toast({
            title: "Failed to Create Account",
            description: authError.message,
            variant: "destructive"
          });
          return;
        }

        if (authData.user) {
          // Add to admin_users table immediately
          const { error: adminError } = await supabase
            .from('admin_users')
            .insert({
              user_id: authData.user.id,
              email: pendingEmail,
              role: 'admin'
            });

          if (adminError) {
            console.error("Error creating admin user:", adminError);
          }

          toast({
            title: "Admin Account Created Successfully",
            description: "You can now sign in with your credentials",
          });
          
          // Reset form and go back to sign in
          setShowOTPStep(false);
          setOtpCode('');
          setPendingEmail('');
          setEmail(pendingEmail);
        }
      } catch (error) {
        toast({
          title: "An error occurred",
          description: "Please try again",
          variant: "destructive"
        });
      } finally {
        setIsVerifyingOTP(false);
      }
    }
  };

  const resetOTPFlow = () => {
    setShowOTPStep(false);
    setOtpCode('');
    setPendingEmail('');
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
                <form onSubmit={handleSignUp} className="space-y-4">
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
                  <form onSubmit={handleSignUp} className="space-y-4">
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