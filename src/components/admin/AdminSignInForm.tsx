import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

interface AdminSignInFormProps {
  onSignIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
  isLoading?: boolean;
}

export const AdminSignInForm = ({ onSignIn, isLoading }: AdminSignInFormProps) => {
  const [email, setEmail] = useState('sativinay21@gmail.com');
  const [password, setPassword] = useState('Admin123!@#');
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSigningIn(true);

    try {
      const { data, error } = await onSignIn(email, password);

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        disabled={isSigningIn || isLoading}
      >
        {isSigningIn ? "Signing In..." : "Admin Sign In"}
      </Button>
    </form>
  );
};