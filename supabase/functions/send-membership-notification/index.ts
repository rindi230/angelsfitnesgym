// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface MembershipEmailRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  planName: string;
  planPrice: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (!resendApiKey) {
      console.error("RESEND_API_KEY is not set in environment variables");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const resend = new Resend(resendApiKey);

    const { customerName, customerEmail, customerPhone, planName, planPrice }: MembershipEmailRequest = await req.json();

    console.log(`Processing membership inquiry for: ${customerName} - ${planName} Plan`);

    const emailResponse = await resend.emails.send({
      from: "Angels Fitness <onboarding@resend.dev>",
      to: ["rindisedna@gmail.com"],
      subject: `New Membership Plan Interest: ${planName} Plan`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #dc2626; text-align: center;">New Membership Plan Interest!</h1>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #374151; margin-top: 0;">Customer Information</h2>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">Customer Name:</td>
                <td style="padding: 8px 0; color: #6b7280;">${customerName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">Customer Email:</td>
                <td style="padding: 8px 0; color: #6b7280;">${customerEmail}</td>
              </tr>

              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">Customer Phone:</td>
                <td style="padding: 8px 0; color: #6b7280;">${customerPhone}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">Interested Plan:</td>
                <td style="padding: 8px 0; color: #6b7280;">${planName} Plan</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">Plan Price:</td>
                <td style="padding: 8px 0; color: #6b7280;">$${planPrice}/month</td>
              </tr>
            </table>
          </div>
          
          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <h3 style="color: #92400e; margin: 0 0 10px 0;">Next Steps</h3>
            <p style="color: #78350f; margin: 0; font-size: 14px;">
              Please follow up with this potential member to schedule a gym tour and complete their membership registration.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #6b7280; font-size: 14px;">
              This notification was sent automatically from Angels Fitness membership inquiry system.
            </p>
          </div>
        </div>
      `,
    });

    console.log("Membership inquiry email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailId: emailResponse.data?.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending membership inquiry email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);