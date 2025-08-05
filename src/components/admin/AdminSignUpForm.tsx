import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { useAdminOTP } from '@/hooks/useAdminOTP';

interface AdminSignUpFormProps {
  isSetupMode: boolean;
}

export const AdminSignUpForm = ({ isSetupMode }: AdminSignUpFormProps) => {
  const [email, setEmail] = useState('sativinay21@gmail.com');
  const [password, setPassword] = useState('Admin123!@#');
  const [otpCode, setOtpCode] = useState('');
  const [showOTPStep, setShowOTPStep] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');

  const { sendOTP, verifyOTP, createAccount, isSendingOTP, isVerifyingOTP } = useAdminOTP();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await sendOTP(email);
    
    if (result.success) {
      setPendingEmail(email);
      setShowOTPStep(true);
    }
  };

  const handleVerifyOTPAndCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Step 1: Verify OTP
    const otpResult = await verifyOTP(pendingEmail, otpCode);
    
    if (!otpResult.success) {
      return;
    }

    // Step 2: Create Supabase Auth user
    const accountResult = await createAccount(pendingEmail, password);

    if (accountResult.success) {
      toast({
        title: "Admin Account Created Successfully",
        description: "You can now sign in with your credentials",
      });
      
      // Reset form and switch to sign in
      resetOTPFlow();
      setEmail(pendingEmail);
    } else {
      if (accountResult.error?.message.includes('already registered')) {
        toast({
          title: "Account Already Exists",
          description: "Please use the Sign In tab to login",
          variant: "destructive"
        });
        resetOTPFlow();
      } else {
        toast({
          title: "Failed to Create Account",
          description: accountResult.error?.message || "Please try again",
          variant: "destructive"
        });
      }
    }
  };

  const resetOTPFlow = () => {
    setShowOTPStep(false);
    setOtpCode('');
    setPendingEmail('');
  };

  if (showOTPStep) {
    return (
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
    );
  }

  return (
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
  );
};