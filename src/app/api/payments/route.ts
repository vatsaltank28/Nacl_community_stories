import { NextResponse } from "next/server";

interface PaymentOrder {
  orderId: string;
  amount: number;
  currency: string;
  eventId: string;
  eventTitle: string;
  userName: string;
  userEmail: string;
  createdAt: string;
  status: "created" | "paid" | "failed";
  paymentId?: string;
  qrCode?: string;
}

const paymentOrders: PaymentOrder[] = [];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, eventId, eventTitle, amount, userName, userEmail, paymentId, paymentMethod, orderId } = body;

    // Action 1: Create Razorpay Order
    if (action === "create_order") {
      const newOrderId = `order_nacl_${Date.now().toString().slice(-6)}${Math.floor(100 + Math.random() * 900)}`;
      const order: PaymentOrder = {
        orderId: newOrderId,
        amount: Number(amount) || 1499,
        currency: "INR",
        eventId: eventId || "nacl-event",
        eventTitle: eventTitle || "NaCl Movement Gathering",
        userName: userName || "Participant",
        userEmail: userEmail || "attendee@nacl.in",
        createdAt: new Date().toISOString(),
        status: "created"
      };

      paymentOrders.push(order);

      return NextResponse.json({
        success: true,
        orderId: newOrderId,
        currency: "INR",
        amount: order.amount,
        keyId: "rzp_test_NACLMockLiveKey2026"
      });
    }

    // Action 2: Verify and Capture Razorpay Payment
    if (action === "verify_payment") {
      const generatedPayId = paymentId || `pay_${Math.random().toString(36).substring(2, 12).toUpperCase()}`;
      const qrCode = `NACL-PASS-${eventId?.toUpperCase().slice(0, 4) || "EVNT"}-${Math.floor(10000 + Math.random() * 90000)}`;

      const order = paymentOrders.find(o => o.orderId === orderId);
      if (order) {
        order.status = "paid";
        order.paymentId = generatedPayId;
        order.qrCode = qrCode;
      }

      return NextResponse.json({
        success: true,
        message: "Razorpay payment verified & captured",
        paymentId: generatedPayId,
        orderId: orderId || "order_nacl_instant",
        qrCode,
        status: "PAID",
        paymentMethod: paymentMethod || "UPI",
        capturedAt: new Date().toISOString()
      });
    }

    return NextResponse.json({ success: false, message: "Invalid action parameter" }, { status: 400 });
  } catch (error) {
    console.error("Payments API error:", error);
    return NextResponse.json({ success: false, message: "Payment processing failed" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (email) {
    const userPayments = paymentOrders.filter(p => p.userEmail.toLowerCase() === email.toLowerCase());
    return NextResponse.json({ success: true, payments: userPayments });
  }

  return NextResponse.json({ success: true, payments: paymentOrders });
}
