// stripe listen --forward-to localhost:3000/api/webhooks/stripe

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { env } from "~/env";
import { db } from "~/server/db";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-04-30.basil",
});

const webhookSecret = env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature") ?? "";

    console.log("Webhook received, signature:", signature ? "present" : "missing");

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error) {
      console.error("Webhook signature verification failed", error);
      return new NextResponse("Webhook signature verification failed", {
        status: 400,
      });
    }

    console.log("Received Stripe webhook:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const customerId = session.customer as string;

      console.log("Processing checkout session for customer:", customerId);
      console.log("Session ID:", session.id);

      const retrievedSession = await stripe.checkout.sessions.retrieve(
        session.id,
        { expand: ["line_items"] },
      );

      console.log("Retrieved session line items:", retrievedSession.line_items?.data.length || 0);

      const lineItems = retrievedSession.line_items;
      if (lineItems && lineItems.data.length > 0) {
        const priceId = lineItems.data[0]?.price?.id ?? undefined;

        console.log("Price ID from line item:", priceId);
        console.log("Expected price IDs:", {
          small: env.STRIPE_SMALL_CREDIT_PACK,
          medium: env.STRIPE_MEDIUM_CREDIT_PACK,
          large: env.STRIPE_LARGE_CREDIT_PACK,
        });

        if (priceId) {
          let creditsToAdd = 0;

          if (priceId === env.STRIPE_SMALL_CREDIT_PACK) {
            creditsToAdd = 50;
          } else if (priceId === env.STRIPE_MEDIUM_CREDIT_PACK) {
            creditsToAdd = 150;
          } else if (priceId === env.STRIPE_LARGE_CREDIT_PACK) {
            creditsToAdd = 500;
          } else {
            console.error("Unknown price ID:", priceId);
            return new NextResponse("Unknown price ID", { status: 400 });
          }

          console.log(`Adding ${creditsToAdd} credits for price ID: ${priceId}`);

          // Find user by stripe customer ID
          const user = await db.user.findUnique({
            where: { stripeCustomerId: customerId },
          });

          if (!user) {
            console.error("User not found for Stripe customer ID:", customerId);
            return new NextResponse("User not found", { status: 404 });
          }

          console.log("Found user:", user.email, "Current credits:", user.credits);

          // Update user credits
          const updatedUser = await db.user.update({
            where: { stripeCustomerId: customerId },
            data: {
              credits: {
                increment: creditsToAdd,
              },
            },
          });

          console.log(`Successfully added ${creditsToAdd} credits to user ${user.email}. New total: ${updatedUser.credits}`);
        } else {
          console.error("No price ID found in line items");
          return new NextResponse("No price ID found", { status: 400 });
        }
      } else {
        console.error("No line items found in session");
        return new NextResponse("No line items found", { status: 400 });
      }
    } else {
      console.log("Ignored webhook event type:", event.type);
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new NextResponse("Webhook error", { status: 500 });
  }
}
