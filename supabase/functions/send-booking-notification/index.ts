// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface BookingNotificationRequest {
  customerName: string;
  customerEmail: string;
  className: string;
  classId: number;
  bookingTime: string;
}

interface ShoppingNotificationRequest {
  customerName: string;
  customerEmail: string;
  orderId: string;
  totalAmount: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  purchaseTime: string;
}

interface MembershipNotificationRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  planName: string;
  planPrice: number;
  planDuration: string;
  registrationTime: string;
}

type NotificationRequest = BookingNotificationRequest | ShoppingNotificationRequest | MembershipNotificationRequest;
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

    const requestData: any = await req.json();
    
    // Log the received data for debugging
    console.log("Received request data:", JSON.stringify(requestData, null, 2));
    console.log("className:", requestData.className);
    console.log("classId:", requestData.classId);
    console.log("customerName:", requestData.customerName);
    console.log("customerEmail:", requestData.customerEmail);
    console.log("planName:", requestData.planName);
    console.log("customerPhone:", requestData.customerPhone);
    console.log("planPrice:", requestData.planPrice);
    
    // Check which type of notification this is
    console.log("Is membership notification?", !!(requestData.planName && requestData.customerPhone && requestData.planPrice));
    console.log("Is booking notification?", !!(requestData.className && requestData.classId));
    console.log("DEBUG - planName:", requestData.planName);
    console.log("DEBUG - customerPhone:", requestData.customerPhone);
    console.log("DEBUG - planPrice:", requestData.planPrice);
    console.log("DEBUG - className:", requestData.className);
    console.log("DEBUG - classId:", requestData.classId);
    
    // Determine notification type based on the data structure
    let emailResponse;
    
    // Check if this is a membership notification by looking for planName
    if (requestData.planName && requestData.planName !== undefined && requestData.planName !== null) {
      // Membership notification
      const { customerName, customerEmail, customerPhone, planName, planPrice, planDuration, registrationTime } = requestData as MembershipNotificationRequest;
      console.log(`Processing membership notification for: ${customerName} - ${planName}`);
      
      // Ensure we have valid data
      const safeCustomerName = customerName || 'Unknown Customer';
      const safeCustomerEmail = customerEmail || 'No email provided';
      const safeCustomerPhone = customerPhone || 'No phone provided';
      const safePlanName = planName || 'Unknown Plan';
      const safePlanPrice = planPrice || 0;
      const safePlanDuration = planDuration || 'Unknown Duration';
      const safeRegistrationTime = registrationTime || new Date().toLocaleString();

      emailResponse = await resend.emails.send({
        from: "Angels Fitness <onboarding@resend.dev>",
        to: ["rindisedna@gmail.com"],
        subject: `New Membership Registration: ${safePlanName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #dc2626; text-align: center;">🏋️ New Membership Registration Alert!</h1>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #374151; margin-top: 0;">👤 Customer Information</h2>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">Full Name:</td>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 16px;">${safeCustomerName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">Email Address:</td>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 16px;">${safeCustomerEmail}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">Phone Number:</td>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 16px;">${safeCustomerPhone}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">Registration Time:</td>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 16px;">${safeRegistrationTime}</td>
                </tr>
              </table>
            </div>

            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #374151; margin-top: 0;">💳 Selected Membership Plan</h2>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">Plan Name:</td>
                  <td style="padding: 8px 0; color: #dc2626; font-weight: bold; font-size: 18px;">${safePlanName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">Billing Cycle:</td>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 16px;">${safePlanDuration}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">Monthly Price:</td>
                  <td style="padding: 8px 0; color: #dc2626; font-weight: bold; font-size: 20px;">$${safePlanPrice.toFixed(2)}</td>
                </tr>
              </table>
            </div>

            <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
              <h3 style="color: #92400e; margin-top: 0;">📞 Action Required</h3>
              <p style="color: #92400e; margin: 0;">
                <strong>${safeCustomerName}</strong> has registered interest in the <strong>${safePlanName}</strong> membership plan. 
                Please contact them at <strong>${safeCustomerEmail}</strong> or <strong>${safeCustomerPhone}</strong> to complete the registration process and collect payment.
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #6b7280; font-size: 14px;">
                This notification was sent automatically from Angels Fitness membership registration system.
              </p>
            </div>
          </div>
        `,
      });
    } else if (requestData.className && requestData.classId && !requestData.planName) {
      // Booking notification
      const { customerName, customerEmail, className, classId, bookingTime } = requestData as BookingNotificationRequest;
      console.log(`Processing booking notification for: ${customerName} - ${className}`);
      
      // Add fallback values if needed
      const safeClassName = className || 'Unknown Class';
      const safeClassId = classId || 'Unknown';
      const safeBookingTime = bookingTime || new Date().toLocaleString();

      emailResponse = await resend.emails.send({
        from: "Angels Fitness <onboarding@resend.dev>",
        to: ["rindisedna@gmail.com"],
        subject: `New Class Booking: ${safeClassName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #dc2626; text-align: center;">New Class Booking Alert!</h1>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #374151; margin-top: 0;">Booking Details</h2>
              
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
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">Class Name:</td>
                  <td style="padding: 8px 0; color: #6b7280;">${safeClassName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">Class ID:</td>
                  <td style="padding: 8px 0; color: #6b7280;">#${safeClassId}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">Booking Time:</td>
                  <td style="padding: 8px 0; color: #6b7280;">${safeBookingTime}</td>
                </tr>
              </table>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #6b7280; font-size: 14px;">
                This notification was sent automatically from Angels Fitness booking system.
              </p>
            </div>
          </div>
        `,
      });
    } else if (requestData.orderId && requestData.items) {
      // Shopping notification
      const { customerName, customerEmail, orderId, totalAmount, items, purchaseTime } = requestData as ShoppingNotificationRequest;
      console.log(`Processing shopping notification for: ${customerName} - Order #${orderId}`);

      const itemsTable = items.map(item => `
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 12px 8px; color: #374151;">${item.name}</td>
          <td style="padding: 12px 8px; color: #6b7280; text-align: center;">${item.quantity}</td>
          <td style="padding: 12px 8px; color: #6b7280; text-align: right;">$${item.price.toFixed(2)}</td>
          <td style="padding: 12px 8px; color: #374151; font-weight: bold; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `).join('');

      emailResponse = await resend.emails.send({
        from: "Angels Fitness <onboarding@resend.dev>",
        to: ["rindisedna@gmail.com"],
        subject: `New Product Purchase: Order #${orderId}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #dc2626; text-align: center;">New Product Purchase Alert!</h1>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #374151; margin-top: 0;">Purchase Details</h2>
              
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
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">Order ID:</td>
                  <td style="padding: 8px 0; color: #6b7280;">#${orderId}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">Purchase Time:</td>
                  <td style="padding: 8px 0; color: #6b7280;">${purchaseTime}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">Total Amount:</td>
                  <td style="padding: 8px 0; color: #dc2626; font-weight: bold; font-size: 18px;">$${totalAmount.toFixed(2)}</td>
                </tr>
              </table>
            </div>

            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #374151; margin-top: 0;">Purchased Items</h3>
              
              <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                <thead>
                  <tr style="background-color: #e5e7eb;">
                    <th style="padding: 12px 8px; text-align: left; color: #374151; font-weight: bold;">Product</th>
                    <th style="padding: 12px 8px; text-align: center; color: #374151; font-weight: bold;">Qty</th>
                    <th style="padding: 12px 8px; text-align: right; color: #374151; font-weight: bold;">Price</th>
                    <th style="padding: 12px 8px; text-align: right; color: #374151; font-weight: bold;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsTable}
                </tbody>
              </table>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #6b7280; font-size: 14px;">
                This notification was sent automatically from Angels Fitness shopping system.
              </p>
            </div>
          </div>
        `,
      });
    } else {
      throw new Error("Invalid notification data structure");
    }

    console.log("Email notification sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailId: emailResponse.data?.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending email notification:", error);
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
