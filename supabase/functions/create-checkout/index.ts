
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CheckoutRequest {
  items: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
  }>;
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting checkout process...");
    
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    
    if (!stripeKey) {
      console.error("STRIPE_SECRET_KEY is not set in environment variables");
      return new Response(
        JSON.stringify({ error: "Payment service not configured. Please contact support." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Stripe key found, initializing Stripe...");
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    const requestBody = await req.json();
    console.log("Request body received:", JSON.stringify(requestBody, null, 2));

    const { items, customerEmail, successUrl, cancelUrl }: CheckoutRequest = requestBody;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error("No items provided");
      return new Response(
        JSON.stringify({ error: "No items provided for checkout" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    if (!customerEmail) {
      console.error("No customer email provided");
      return new Response(
        JSON.stringify({ error: "Customer email is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`Creating checkout for ${items.length} items for ${customerEmail}`);

    // Create line items for Stripe
    const lineItems = items.map(item => {
      console.log(`Processing item: ${item.name} - $${item.price} x ${item.quantity}`);
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      };
    });

    console.log("Line items created:", JSON.stringify(lineItems, null, 2));

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: customerEmail,
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        customer_email: customerEmail,
      },
    });

    console.log("Stripe checkout session created successfully:", session.id);

    // Create order record in database
    try {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
        { auth: { persistSession: false } }
      );

      const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_email: customerEmail,
          total_amount: totalAmount,
          stripe_session_id: session.id,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) {
        console.error("Error creating order:", orderError);
      } else {
        console.log("Order created:", order.id);
        
        // Create order items
        const orderItems = items.map(item => ({
          order_id: order.id,
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) {
          console.error("Error creating order items:", itemsError);
        } else {
          console.log("Order items created successfully");
        }
      }
    } catch (dbError) {
      console.error("Database error (non-critical):", dbError);
    }

    return new Response(
      JSON.stringify({ 
        sessionId: session.id,
        url: session.url 
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
    console.error("Error creating checkout session:", error);
    console.error("Error stack:", error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "An unexpected error occurred during checkout",
        details: "Please try again or contact support if the issue persists"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
