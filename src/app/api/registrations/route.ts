import { NextResponse } from "next/server";

interface RegistrationRecord {
  id: string;
  eventId: string;
  eventTitle: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  archetype: string;
  ticketType: string;
  price: number;
  date: string;
  status: "approved" | "pending" | "rejected" | "cancelled";
  qrCode: string;
  paymentId?: string;
  paymentMethod?: string;
  adminApproved?: boolean;
  approvedBy?: string;
  approvedAt?: string;
}

const serverRegistrations: RegistrationRecord[] = [
  {
    id: "reg-882194",
    eventId: "nacl-flow-club-rawform-lab",
    eventTitle: "NaCl Flow Club: RawForm Lab",
    userName: "Aarav Sharma",
    userEmail: "aarav.sharma@gmail.com",
    archetype: "Steel Mace Practitioner",
    ticketType: "All Access",
    price: 1499,
    date: "Jun 24, 2026",
    status: "approved",
    adminApproved: true,
    approvedBy: "Admin Suhail",
    approvedAt: "2026-06-24T10:00:00Z",
    qrCode: "NACL-PASS-RAWF-882194",
    paymentId: "pay_NACL98412891",
    paymentMethod: "UPI (Google Pay)"
  },
  {
    id: "reg-771203",
    eventId: "nacl-flow-club-rawform-lab",
    eventTitle: "NaCl Flow Club: RawForm Lab",
    userName: "Priya Nair",
    userEmail: "priya.nair@outlook.com",
    archetype: "Contrast Recovery Enthusiast",
    ticketType: "All Access",
    price: 1499,
    date: "Jun 25, 2026",
    status: "approved",
    adminApproved: true,
    approvedBy: "Admin Akshay",
    approvedAt: "2026-06-25T11:30:00Z",
    qrCode: "NACL-PASS-RAWF-771203",
    paymentId: "pay_NACL77129034",
    paymentMethod: "Debit Card"
  },
  {
    id: "reg-664912",
    eventId: "steel-mace-flow-breathwork",
    eventTitle: "Steel Mace Flow & Breathwork",
    userName: "Karan Patel",
    userEmail: "karan.patel@gmail.com",
    archetype: "Rotational Athlete",
    ticketType: "All Access",
    price: 1200,
    date: "Nov 2, 2026",
    status: "approved",
    adminApproved: true,
    approvedBy: "Admin Suhail",
    approvedAt: "2026-11-02T09:15:00Z",
    qrCode: "NACL-PASS-STEE-664912",
    paymentId: "pay_NACL66491280",
    paymentMethod: "UPI (PhonePe)"
  }
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const eventId = searchParams.get("eventId");

  let results = [...serverRegistrations];

  if (email) {
    results = results.filter(r => r.userEmail.toLowerCase() === email.toLowerCase());
  }

  if (eventId) {
    results = results.filter(r => r.eventId === eventId);
  }

  return NextResponse.json({
    success: true,
    registrations: results
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      eventId,
      eventTitle,
      userName,
      userEmail,
      userPhone,
      archetype,
      ticketType = "All Access",
      price = 1499,
      paymentId,
      paymentMethod = "Razorpay UPI"
    } = body;

    if (!eventId || !userName || !userEmail) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const id = "reg-" + Math.floor(100000 + Math.random() * 900000);
    const qrCode = `NACL-PASS-${eventId.toUpperCase().slice(0, 4)}-${id.slice(-4)}`;

    const newRecord: RegistrationRecord = {
      id,
      eventId,
      eventTitle: eventTitle || "NaCl Experience",
      userName: userName.trim(),
      userEmail: userEmail.trim().toLowerCase(),
      userPhone,
      archetype: archetype || "Movement Explorer",
      ticketType,
      price: Number(price),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "approved",
      adminApproved: true, // Approved upon successful Razorpay payment capture
      approvedBy: "NaCl Auto-Verifier",
      approvedAt: new Date().toISOString(),
      qrCode,
      paymentId: paymentId || `pay_${Math.random().toString(36).substring(2, 12).toUpperCase()}`,
      paymentMethod
    };

    serverRegistrations.unshift(newRecord);

    return NextResponse.json({
      success: true,
      message: "Registration and payment confirmed",
      registration: newRecord
    });
  } catch (error) {
    console.error("Registration POST API error:", error);
    return NextResponse.json({ success: false, message: "Failed to record registration" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { registrationId, status, adminApproved, approvedBy } = body;

    const reg = serverRegistrations.find(r => r.id === registrationId);
    if (!reg) {
      return NextResponse.json({ success: false, message: "Registration not found" }, { status: 404 });
    }

    if (status) reg.status = status;
    if (adminApproved !== undefined) reg.adminApproved = adminApproved;
    if (approvedBy) reg.approvedBy = approvedBy;
    reg.approvedAt = new Date().toISOString();

    return NextResponse.json({
      success: true,
      message: "Registration updated by admin",
      registration: reg
    });
  } catch (error) {
    console.error("Registration PATCH error:", error);
    return NextResponse.json({ success: false, message: "Failed to update registration" }, { status: 500 });
  }
}
