import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AdminOTPRequest {
  requestedEmail: string; // The email someone wants to make admin
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
    const { requestedEmail }: AdminOTPRequest = await req.json();
    
    console.log(`Admin OTP requested for email: ${requestedEmail}`);

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // OTP expires in 10 minutes
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Clean up any existing OTPs for this email
    await supabase
      .from('admin_otps')
      .delete()
      .eq('email', requestedEmail);

    // Store OTP in database
    const { error: insertError } = await supabase
      .from('admin_otps')
      .insert({
        email: requestedEmail,
        otp_code: otpCode,
        expires_at: expiresAt.toISOString(),
        verified: false
      });

    if (insertError) {
      console.error("Error storing OTP:", insertError);
      throw new Error("Failed to generate OTP");
    }

    // ALWAYS send OTP to authorized admin email regardless of requested email
    const ADMIN_EMAIL = "sativinay21@gmail.com";
    
    const emailResponse = await resend.emails.send({
      from: "XStore Admin <onboarding@resend.dev>",
      to: [ADMIN_EMAIL],
      subject: "🔐 Admin Access Request - OTP Required",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; text-align: center;">Admin Access Request</h1>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #495057; margin-top: 0;">Request Details:</h2>
            <p><strong>Requested Admin Email:</strong> ${requestedEmail}</p>
            <p><strong>Request Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h2 style="color: #1976d2; margin-top: 0;">Your OTP Code:</h2>
            <div style="font-size: 32px; font-weight: bold; color: #1976d2; letter-spacing: 4px; margin: 20px 0;">
              ${otpCode}
            </div>
            <p style="color: #666; margin-bottom: 0;">This code expires in 10 minutes</p>
          </div>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #856404;">
              ⚠️ <strong>Security Notice:</strong> Only share this OTP if you want to authorize 
              "${requestedEmail}" as an admin. If you didn't expect this request, ignore this email.
            </p>
          </div>
          
          <p style="color: #666; text-align: center; margin-top: 30px;">
            This is an automated security message from XStore Admin System.
          </p>
        </div>
      `,
    });

    console.log("OTP email sent successfully to:", ADMIN_EMAIL);
    console.log("Email response:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `OTP sent to admin for verification of ${requestedEmail}`,
        expiresIn: "10 minutes"
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
    console.error("Error in send-admin-otp function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to send OTP" 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);