
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Lock } from 'lucide-react';

// This is a simplified authentication mechanism for demonstration purposes
// In a real production environment, you would use a secure authentication system
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "xstore2025";

interface AdminAuthProps {
  onAuthSuccess: () => void;
}

const AdminAuth = ({ onAuthSuccess }: AdminAuthProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check if user is already authenticated
  useEffect(() => {
    const adminAuth = localStorage.getItem('xstore_admin_auth');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
      onAuthSuccess();
    }
  }, [onAuthSuccess]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simple authentication check
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Set authentication status in localStorage
      localStorage.setItem('xstore_admin_auth', 'true');
      
      setIsAuthenticated(true);
      setIsSubmitting(false);
      toast({
        title: "Authentication Successful",
        description: "Welcome to the Admin Dashboard",
      });
      onAuthSuccess();
    } else {
      setIsSubmitting(false);
      toast({
        title: "Authentication Failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
    }
  };
  
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-xstore-green bg-opacity-10 mb-4">
            <Lock className="h-8 w-8 text-xstore-green" />
          </div>
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="text-gray-600 mt-2">Enter your credentials to access the dashboard</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
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
            className="w-full bg-xstore-green"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Authenticating..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminAuth;
