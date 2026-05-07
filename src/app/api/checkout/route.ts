/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/checkout/route.ts
import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

export async function POST(req: NextRequest) {
  const { amount, name, currency,
    userId,
    pricePaid,
    packageId,
    priceId,
    duration,
    startDate,
    endDate,
    selectedSellingPriceRange,
    sellerType,
    vehicleType,
    vehicleId
  } = await req.json();

  try {
        // const successUrl = `${req.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}` +
        const successUrl = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/success?session_id={CHECKOUT_SESSION_ID}` +
      `&userId=${encodeURIComponent(userId ?? "")}` +
      `&pricePaid=${encodeURIComponent(pricePaid ?? "")}` +
      `&packageId=${encodeURIComponent(packageId ?? "")}` +
      `&priceId=${encodeURIComponent(priceId ?? "")}` +
      `&duration=${encodeURIComponent(duration ?? "")}` +
      `&name=${encodeURIComponent(name ?? "")}` +
      `&startDate=${encodeURIComponent(startDate ?? "")}` +
      `&endDate=${encodeURIComponent(endDate ?? "")}` +
      `&selectedSellingPriceRange=${encodeURIComponent(selectedSellingPriceRange ?? "")}` +
      `&sellerType=${encodeURIComponent(sellerType ?? "")}` +
      `&vehicleType=${encodeURIComponent(vehicleType ?? "")}` +
      `&vehicleId=${encodeURIComponent(vehicleId ?? "")}`;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: currency || "usd",
            product_data: {
              name: name || "Test Product",
            description: "One-time payment for testing",
            // images: ["https://example.com/test-product.jpg"],
            },
            unit_amount: amount, // amount in cents
          },
          quantity: 1,
        },
      ],
      //   success_url: `${req.nextUrl.origin}/success`,
      success_url: successUrl,
       cancel_url: `${req.nextUrl.origin}/cancel`,
    });
    console.log(session, "check session");

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
