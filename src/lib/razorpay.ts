"use client";

import { EventType, saveOrderRecord, OrderRecordType } from "./store";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function initiateRazorpayCheckout(
  event: EventType,
  userData: { name: string; email: string },
  onSuccess: (order: OrderRecordType) => void,
  onFailure: (err: string) => void
) {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    onFailure("Razorpay SDK failed to load. Please check internet connection.");
    return;
  }

  const orderId = "nacl_ord_" + Math.random().toString(36).substring(2, 10).toUpperCase();

  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_nacl_demo",
    amount: event.price * 100, // Amount in paise
    currency: "INR",
    name: "NaCl Active Culture Club",
    description: `Booking: ${event.title}`,
    image: "/logo.png",
    handler: function (response: any) {
      const paymentId = response.razorpay_payment_id || "pay_" + Math.random().toString(36).substring(2, 10);
      
      const orderRecord: OrderRecordType = {
        orderId,
        paymentId,
        eventId: event.id,
        eventTitle: event.title,
        userName: userData.name,
        userEmail: userData.email,
        amount: event.price,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        status: "PAID",
        qrCode: `NACL-TICKET-${orderId}-${event.id}`,
      };

      saveOrderRecord(orderRecord);
      onSuccess(orderRecord);
    },
    prefill: {
      name: userData.name,
      email: userData.email,
    },
    theme: {
      color: "#FF5500",
    },
    modal: {
      ondismiss: function () {
        onFailure("Payment window closed by user.");
      },
    },
  };

  try {
    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err: any) {
    onFailure(err.message || "Failed to launch Razorpay checkout.");
  }
}
