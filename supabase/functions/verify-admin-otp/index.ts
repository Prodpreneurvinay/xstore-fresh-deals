import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface VerifyOTPRequest {
  email: string;
  otpCode: string;
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, otpCode }: VerifyOTPRequest = await req.json();
    
    console.log(`Verifying OTP for email: ${email}, code: ${otpCode}`);

    // Find valid OTP
    const { data: otpData, error: fetchError } = await supabase
      .from('admin_otps')
      .select('*')
      .eq('email', email)
      .eq('otp_code', otpCode)
      .eq('verified', false)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (fetchError || !otpData) {
      console.log("Invalid or expired OTP:", fetchError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Invalid or expired OTP code" 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Mark OTP as verified
    const { error: updateError } = await supabase
      .from('admin_otps')
      .update({ verified: true })
      .eq('id', otpData.id);

    if (updateError) {
      console.error("Error updating OTP:", updateError);
      throw new Error("Failed to verify OTP");
    }

    console.log("OTP verified successfully for:", email);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "OTP verified successfully",
        email: email
      }), 
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in verify-admin-otp function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to verify OTP" 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);