import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Event } from "@/models/Event";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const data = await req.json();
    await dbConnect();
    const newEvent = await Event.create(data);
    
    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const events = await Event.find({}).sort({ createdAt: -1 });
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}