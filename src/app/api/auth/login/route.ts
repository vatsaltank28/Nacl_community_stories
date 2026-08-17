import { NextResponse } from "next/server";

// In-memory / persistent mock user database for server sessions
interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  provider: "google" | "phone";
  archetype?: string;
  createdAt: string;
}

const registeredUsers: UserRecord[] = [];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, email, name, phone, otp } = body;

    // 1. Google Authentication
    if (type === "google") {
      if (!email) {
        return NextResponse.json({ success: false, message: "Google email is required" }, { status: 400 });
      }

      const existing = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return NextResponse.json({
          success: true,
          message: "Google login successful",
          user: existing
        });
      }

      const newUser: UserRecord = {
        id: "usr_g_" + Math.random().toString(36).substring(2, 10),
        name: name || email.split("@")[0],
        email: email.toLowerCase(),
        provider: "google",
        createdAt: new Date().toISOString()
      };
      registeredUsers.push(newUser);

      return NextResponse.json({
        success: true,
        message: "Google account connected",
        user: newUser
      });
    }

    // 2. Phone OTP Authentication
    if (type === "phone") {
      if (!phone || phone.length < 10) {
        return NextResponse.json({ success: false, message: "Valid 10-digit mobile number required" }, { status: 400 });
      }

      // If verifying OTP
      if (otp) {
        if (otp !== "1234" && otp.length !== 4) {
          return NextResponse.json({ success: false, message: "Invalid OTP code" }, { status: 400 });
        }

        const cleanPhone = phone.replace(/\D/g, "").slice(-10);
        const autoEmail = `${cleanPhone}@phone.nacl.in`;
        
        let user = registeredUsers.find(u => u.phone === cleanPhone);
        if (!user) {
          user = {
            id: "usr_p_" + Math.random().toString(36).substring(2, 10),
            name: name || `Mover ${cleanPhone.slice(-4)}`,
            email: autoEmail,
            phone: cleanPhone,
            provider: "phone",
            createdAt: new Date().toISOString()
          };
          registeredUsers.push(user);
        }

        return NextResponse.json({
          success: true,
          message: "Mobile verified successfully",
          user
        });
      }

      // If sending OTP
      return NextResponse.json({
        success: true,
        message: "OTP sent to +91 " + phone.slice(-10),
        demoOtp: "1234"
      });
    }

    return NextResponse.json({ success: false, message: "Unsupported login type" }, { status: 400 });
  } catch (error) {
    console.error("Auth login API error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
