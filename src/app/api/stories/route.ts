import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Story from "@/models/Story";

const INITIAL_STORIES = [
  {
    id: "story-1",
    customerName: "Aarav Sharma",
    eventId: "nacl-flow-club-rawform-lab",
    eventTitle: "NaCl Flow Club: RawForm Lab",
    experience: "The steel mace flow and animal movement session completely shifted my perspective on mobility and body control. Incredible energy!",
    photo: "https://wwpiutgexsehvoqicydp.supabase.co/storage/v1/object/public/event-images/user_3ELaY1WvidCusp6N022FRw0w6bR/1780583942070-d2297891.png",
    date: "Jun 2025"
  },
  {
    id: "story-2",
    customerName: "Priya Nair",
    eventId: "sunset-wellness-circle-cold-plunge",
    eventTitle: "Sunset Wellness Circle & Cold Plunge",
    experience: "The sunset breathwork circle followed by the 3-minute cold plunge was deeply transformative. Found genuine peace & connection.",
    photo: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop",
    date: "Oct 2025"
  },
  {
    id: "story-3",
    customerName: "Karan Patel",
    eventId: "steel-mace-flow-breathwork",
    eventTitle: "Steel Mace Flow & Breathwork",
    experience: "Learning the 360 swing mechanics in Bandra with the NaCl crew was electric. Grounding diaphragmatic breathwork after was top tier.",
    photo: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000&auto=format&fit=crop",
    date: "Nov 2025"
  },
  {
    id: "story-4",
    customerName: "Ananya Deshmukh",
    eventId: "animal-flow-mobility-intensive",
    eventTitle: "Animal Flow & Mobility Intensive",
    experience: "Early morning movement flow jam on the Race Course grass in Coimbatore! My wrists and core never felt so alive.",
    photo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1000&auto=format&fit=crop",
    date: "Dec 2025"
  }
];

export async function GET() {
  try {
    const conn = await dbConnect();
    if (!conn) {
      // Instant zero-delay fallback when DB is offline or unreachable
      return NextResponse.json(INITIAL_STORIES);
    }

    const dbStories = await Story.find({}).sort({ createdAt: -1 }).lean();
    
    // Transform Mongo _id to id string
    const formatted = dbStories.map((doc: any) => ({
      id: doc._id.toString(),
      customerName: doc.customerName,
      eventId: doc.eventId,
      eventTitle: doc.eventTitle,
      experience: doc.experience,
      photo: doc.photo,
      date: doc.date
    }));

    if (formatted.length === 0) {
      return NextResponse.json(INITIAL_STORIES);
    }

    return NextResponse.json(formatted);
  } catch (error) {
    console.warn("GET /api/stories DB Error, returning fast fallback:", error);
    return NextResponse.json(INITIAL_STORIES);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerName, eventId, eventTitle, experience, photo } = body;

    if (!customerName || !experience || !photo) {
      return NextResponse.json(
        { error: "Missing required fields: customerName, experience, photo" },
        { status: 400 }
      );
    }

    const date = new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" });

    try {
      const conn = await dbConnect();
      if (conn) {
        const newStoryDoc = await Story.create({
          customerName,
          eventId: eventId || "general",
          eventTitle: eventTitle || "NaCl Experience",
          experience,
          photo,
          date
        });

        const formatted = {
          id: newStoryDoc._id.toString(),
          customerName: newStoryDoc.customerName,
          eventId: newStoryDoc.eventId,
          eventTitle: newStoryDoc.eventTitle,
          experience: newStoryDoc.experience,
          photo: newStoryDoc.photo,
          date: newStoryDoc.date
        };

        return NextResponse.json(formatted, { status: 201 });
      }
    } catch (dbErr) {
      console.warn("MongoDB write skipped/fallback active:", dbErr);
    }

    // Fallback response if DB offline
    const fallbackStory = {
      id: "story-" + Date.now(),
      customerName,
      eventId: eventId || "general",
      eventTitle: eventTitle || "NaCl Experience",
      experience,
      photo,
      date
    };
    return NextResponse.json(fallbackStory, { status: 201 });
  } catch (error) {
    console.error("POST /api/stories error:", error);
    return NextResponse.json({ error: "Failed to create story" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const clearAll = searchParams.get("clearAll");
    const id = searchParams.get("id");

    try {
      const conn = await dbConnect();
      if (conn) {
        if (clearAll === "true") {
          await Story.deleteMany({});
          return NextResponse.json({ success: true, message: "All stories cleared successfully" });
        }
        if (id) {
          if (id.length === 24) {
            await Story.findByIdAndDelete(id);
          } else {
            await Story.deleteMany({ _id: id });
          }
          return NextResponse.json({ success: true, message: "Story deleted successfully" });
        }
      }
    } catch (dbErr) {
      console.warn("MongoDB delete fallback:", dbErr);
    }

    return NextResponse.json({ success: true, message: "Action processed" });
  } catch (error) {
    console.error("DELETE /api/stories error:", error);
    return NextResponse.json({ error: "Failed to delete story" }, { status: 500 });
  }
}
