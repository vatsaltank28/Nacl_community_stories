import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/mongodb";
import { Order } from "@/models/Order";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_fallback", {
  apiVersion: "2024-04-10" as any,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { eventId, title, price } = await req.json();
    await dbConnect();

    // Create a pending order
    const order = await Order.create({
      user: (session.user as any).id,
      event: eventId,
      amount: price,
      status: "pending"
    });

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: title,
            },
            unit_amount: price * 100, // Stripe expects amount in cents/paise
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/events/${eventId}?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/events/${eventId}?canceled=true`,
      client_reference_id: order._id.toString(),
    });

    order.stripeSessionId = checkoutSession.id;
    await order.save();

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "An error occurred during checkout" }, { status: 500 });
  }
}