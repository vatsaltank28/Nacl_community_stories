import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";

// In-memory / DB fallback store
let SUBSCRIBERS_DB: any[] = [];

export async function GET() {
  await dbConnect();
  
  const total = SUBSCRIBERS_DB.length;
  const active = SUBSCRIBERS_DB.filter(s => s.status === "active").length;
  const unsubscribed = SUBSCRIBERS_DB.filter(s => s.status === "unsubscribed").length;

  const cityBreakdown = {
    Bangalore: SUBSCRIBERS_DB.filter(s => s.cityPreference === "Bangalore").length,
    Mumbai: SUBSCRIBERS_DB.filter(s => s.cityPreference === "Mumbai").length,
    Coimbatore: SUBSCRIBERS_DB.filter(s => s.cityPreference === "Coimbatore").length,
    All: SUBSCRIBERS_DB.filter(s => s.cityPreference === "All").length,
  };

  const sourceBreakdown = {
    landing: SUBSCRIBERS_DB.filter(s => s.source === "landing").length,
    pet_widget: SUBSCRIBERS_DB.filter(s => s.source === "pet_widget").length,
    popup: SUBSCRIBERS_DB.filter(s => s.source === "popup").length,
  };

  return NextResponse.json({
    total,
    active,
    unsubscribed,
    cityBreakdown,
    sourceBreakdown,
    subscribers: SUBSCRIBERS_DB,
  });
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { email, name, cityPreference, frequency, source } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email address is required" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingIdx = SUBSCRIBERS_DB.findIndex((s) => s.email.toLowerCase() === normalizedEmail);

    let result;
    if (existingIdx >= 0) {
      result = {
        ...SUBSCRIBERS_DB[existingIdx],
        name: name ? name.trim() : SUBSCRIBERS_DB[existingIdx].name,
        cityPreference: cityPreference || SUBSCRIBERS_DB[existingIdx].cityPreference,
        frequency: frequency || SUBSCRIBERS_DB[existingIdx].frequency,
        status: "active",
        source: source || SUBSCRIBERS_DB[existingIdx].source,
      };
      SUBSCRIBERS_DB[existingIdx] = result;
    } else {
      result = {
        id: "sub-" + Date.now(),
        email: normalizedEmail,
        name: name ? name.trim() : "",
        cityPreference: cityPreference || "All",
        frequency: frequency || "immediate",
        status: "active",
        source: source || "landing",
        subscribedAt: new Date().toISOString(),
      };
      SUBSCRIBERS_DB.unshift(result);
    }

    return NextResponse.json({ success: true, subscriber: result }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to process subscription" }, { status: 500 });
  }
}
