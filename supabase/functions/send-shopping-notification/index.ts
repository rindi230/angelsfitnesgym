// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface ShopNotificationRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    total: number;
  }>;
  totalAmount: number;
  totalItems: number;
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

    const { customerName, customerEmail, customerPhone, items, totalAmount, totalItems }: ShopNotificationRequest = await req.json();

    console.log(`Processing shop purchase for: ${customerName} - ${totalItems} items - $${totalAmount}`);

    // Generate items list HTML
    const itemsListHtml = items.map(item => `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 12px 8px; color: #374151;">${item.name}</td>
        <td style="padding: 12px 8px; color: #6b7280; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px 8px; color: #6b7280; text-align: center;">$${item.price.toFixed(2)}</td>
        <td style="padding: 12px 8px; color: #374151; text-align: right; font-weight: bold;">$${item.total.toFixed(2)}</td>
      </tr>
    `).join('');

    const emailResponse = await resend.emails.send({
      from: "Angels Fitness <onboarding@resend.dev>",
      to: ["rindisedna@gmail.com"],
      subject: `New Shop Purchase: ${totalItems} items - $${totalAmount.toFixed(2)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #dc2626; text-align: center;">New Shop Purchase!</h1>
          
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
            </table>
          </div>

          <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
            <h2 style="color: #374151; margin-top: 0;">Purchase Details</h2>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <thead>
                <tr style="background-color: #f3f4f6;">
                  <th style="padding: 12px 8px; text-align: left; color: #374151; font-weight: bold;">Product</th>
                  <th style="padding: 12px 8px; text-align: center; color: #374151; font-weight: bold;">Qty</th>
                  <th style="padding: 12px 8px; text-align: center; color: #374151; font-weight: bold;">Price</th>
                  <th style="padding: 12px 8px; text-align: right; color: #374151; font-weight: bold;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsListHtml}
              </tbody>
            </table>
            
            <div style="border-top: 2px solid #dc2626; padding-top: 15px; text-align: right;">
              <p style="margin: 5px 0; color: #6b7280; font-size: 16px;">
                <strong>Total Items: ${totalItems}</strong>
              </p>
              <p style="margin: 5px 0; color: #dc2626; font-size: 20px; font-weight: bold;">
                <strong>Total Amount: $${totalAmount.toFixed(2)}</strong>
              </p>
            </div>
          </div>
          
          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <h3 style="color: #92400e; margin: 0 0 10px 0;">Pickup Instructions</h3>
            <p style="color: #78350f; margin: 0; font-size: 14px;">
              Customer is ready to pickup their items. Please have the products prepared and verify customer identity when they arrive at the gym.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #6b7280; font-size: 14px;">
              This notification was sent automatically from Angels Fitness shop system.
            </p>
          </div>
        </div>
      `,
    });

    console.log("Shop purchase notification email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailId: emailResponse.data?.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending shop purchase notification:", error);
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