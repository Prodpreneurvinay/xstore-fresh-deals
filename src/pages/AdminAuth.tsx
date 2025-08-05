import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lock, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { AdminSignInForm } from '@/components/admin/AdminSignInForm';
import { AdminSignUpForm } from '@/components/admin/AdminSignUpForm';

interface AdminAuthProps {
  onAuthSuccess: () => void;
}

const AdminAuth = ({ onAuthSuccess }: AdminAuthProps) => {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading, isSetupMode, signIn, signOut } = useAdminAuth();

  // If user is authenticated and is admin, trigger success
  React.useEffect(() => {
    if (user && isAdmin && !isLoading) {
      onAuthSuccess();
    }
  }, [user, isAdmin, isLoading, onAuthSuccess]);

  const handleSignOut = async () => {
    await signOut();
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

  // If user is authenticated and admin, don't show this form
  if (user && isAdmin) {
    return null;
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
              <AdminSignInForm onSignIn={signIn} isLoading={isLoading} />
            </TabsContent>
            
            <TabsContent value="signup">
              <AdminSignUpForm isSetupMode={isSetupMode} />
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