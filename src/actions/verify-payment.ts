"use server"

import Stripe from "stripe"

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
})

export async function verifyPaymentSession(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "customer"],
    })

    return {
      success: session.payment_status === "paid",
      paymentStatus: session.payment_status,
      customerEmail: session.customer_details?.email,
      amountTotal: session.amount_total,
      currency: session.currency,
      lineItems: session.line_items?.data,
    }
  } catch (error) {
    console.error("Error verifying payment session:", error)
    return {
      success: false,
      error: "Failed to verify payment session",
    }
  }
}
