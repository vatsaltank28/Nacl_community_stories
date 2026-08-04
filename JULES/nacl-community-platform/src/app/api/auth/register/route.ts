import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();
    await dbConnect();
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role === "admin" ? "admin" : "user";
    
    await User.create({ name, email, password: hashedPassword, role: userRole });
    
    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}