import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useAdminOTP = () => {
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);

  const sendOTP = async (email: string) => {
    setIsSendingOTP(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-admin-otp', {
        body: { requestedEmail: email }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "OTP Sent",
        description: "Verification code sent to sativinay21@gmail.com",
      });

      return { success: true, error: null };
    } catch (error: any) {
      toast({
        title: "Failed to Send OTP",
        description: error.message || "Please try again",
        variant: "destructive"
      });
      return { success: false, error };
    } finally {
      setIsSendingOTP(false);
    }
  };

  const verifyOTP = async (email: string, otpCode: string) => {
    setIsVerifyingOTP(true);
    
    try {
      const { data: otpData, error: otpError } = await supabase.functions.invoke('verify-admin-otp', {
        body: { email, otpCode }
      });

      if (otpError || !otpData?.success) {
        throw new Error("Invalid or expired OTP code");
      }

      toast({
        title: "OTP Verified",
        description: "Verification successful",
      });

      return { success: true, error: null };
    } catch (error: any) {
      toast({
        title: "Invalid OTP",
        description: error.message || "Please check the OTP code and try again",
        variant: "destructive"
      });
      return { success: false, error };
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  const createAccount = async (email: string, password: string) => {
    try {
      // Clean auth state first
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
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
          throw new Error("Account already exists. Please use the Sign In tab to login");
        }
        throw authError;
      }

      return { success: true, user: authData.user, error: null };
    } catch (error: any) {
      return { success: false, user: null, error };
    }
  };

  return {
    sendOTP,
    verifyOTP,
    createAccount,
    isSendingOTP,
    isVerifyingOTP
  };
};