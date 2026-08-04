import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Review from "@/models/Review";

const EVENT_CATALOG: Record<string, { eventName: string; city: string; eventImage: string }> = {
  "nacl-flow-club-rawform-lab": {
    eventName: "NaCl Flow Club: RawForm Lab",
    city: "Bangalore",
    eventImage: "https://wwpiutgexsehvoqicydp.supabase.co/storage/v1/object/public/event-images/user_3ELaY1WvidCusp6N022FRw0w6bR/1780583942070-d2297891.png"
  },
  "sunset-wellness-circle-cold-plunge": {
    eventName: "Sunset Wellness Circle & Cold Plunge",
    city: "Bangalore",
    eventImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop"
  },
  "steel-mace-flow-breathwork": {
    eventName: "Steel Mace Flow & Breathwork",
    city: "Mumbai",
    eventImage: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000&auto=format&fit=crop"
  },
  "nacl-coastal-breath-sauna": {
    eventName: "NaCl Coastal Breath & Sauna Jam",
    city: "Mumbai",
    eventImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1000&auto=format&fit=crop"
  },
  "animal-flow-mobility-intensive": {
    eventName: "Animal Flow & Mobility Intensive",
    city: "Coimbatore",
    eventImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1000&auto=format&fit=crop"
  }
};

const INITIAL_REVIEWS = [
  {
    id: "rev-1",
    reviewerName: "Aarav Sharma",
    eventId: "nacl-flow-club-rawform-lab",
    eventName: "NaCl Flow Club: RawForm Lab",
    city: "Bangalore",
    rating: 5,
    reviewText: "The steel mace flow and animal movement session completely shifted my perspective on mobility and body control. Incredible energy!",
    eventImage: "https://wwpiutgexsehvoqicydp.supabase.co/storage/v1/object/public/event-images/user_3ELaY1WvidCusp6N022FRw0w6bR/1780583942070-d2297891.png",
    status: "published",
    createdAt: "2025-06-15T10:00:00.000Z"
  },
  {
    id: "rev-2",
    reviewerName: "Priya Nair",
    eventId: "sunset-wellness-circle-cold-plunge",
    eventName: "Sunset Wellness Circle & Cold Plunge",
    city: "Bangalore",
    rating: 5,
    reviewText: "The sunset breathwork circle followed by the 3-minute cold plunge was deeply transformative. Found genuine peace & connection.",
    eventImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop",
    status: "published",
    createdAt: "2025-10-20T17:30:00.000Z"
  },
  {
    id: "rev-3",
    reviewerName: "Karan Patel",
    eventId: "steel-mace-flow-breathwork",
    eventName: "Steel Mace Flow & Breathwork",
    city: "Mumbai",
    rating: 5,
    reviewText: "Learning the 360 swing mechanics in Bandra with the NaCl crew was electric. Grounding diaphragmatic breathwork after was top tier.",
    eventImage: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000&auto=format&fit=crop",
    status: "published",
    createdAt: "2025-11-12T09:15:00.000Z"
  },
  {
    id: "rev-4",
    reviewerName: "Ananya Deshmukh",
    eventId: "animal-flow-mobility-intensive",
    eventName: "Animal Flow & Mobility Intensive",
    city: "Coimbatore",
    rating: 5,
    reviewText: "Early morning movement flow jam on the Race Course grass in Coimbatore! My wrists and core never felt so alive.",
    eventImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1000&auto=format&fit=crop",
    status: "published",
    createdAt: "2025-12-05T07:00:00.000Z"
  },
  {
    id: "rev-5",
    reviewerName: "Rohan Varma",
    eventId: "nacl-coastal-breath-sauna",
    eventName: "NaCl Coastal Breath & Sauna Jam",
    city: "Mumbai",
    rating: 5,
    reviewText: "Hot sauna sessions followed by ocean breezes in South Mumbai. Pure rejuvenation with an inspiring community of movers.",
    eventImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1000&auto=format&fit=crop",
    status: "published",
    createdAt: "2026-01-18T16:00:00.000Z"
  }
];

// IP rate limit map
const rateLimitMap = new Map<string, number>();

function sanitizeInput(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const cityFilter = searchParams.get("city");
    const limitFilter = parseInt(searchParams.get("limit") || "0", 10);

    const conn = await dbConnect();
    if (!conn) {
      let filtered = INITIAL_REVIEWS;
      if (cityFilter) {
        filtered = filtered.filter(
          (r) => r.city.toLowerCase() === cityFilter.toLowerCase()
        );
      }
      if (limitFilter > 0) {
        filtered = filtered.slice(0, limitFilter);
      }
      return NextResponse.json(filtered);
    }

    const query: any = { status: "published" };
    if (cityFilter) {
      query.city = { $regex: new RegExp(`^${cityFilter}$`, "i") };
    }

    let queryExec = Review.find(query).sort({ createdAt: -1 });
    if (limitFilter > 0) {
      queryExec = queryExec.limit(limitFilter);
    }

    const dbReviews = await queryExec.lean();

    if (!dbReviews || dbReviews.length === 0) {
      return NextResponse.json(INITIAL_REVIEWS);
    }

    const formatted = dbReviews.map((doc: any) => ({
      id: doc._id.toString(),
      reviewerName: doc.reviewerName,
      eventId: doc.eventId,
      eventName: doc.eventName,
      city: doc.city,
      rating: doc.rating,
      reviewText: doc.reviewText,
      eventImage: doc.eventImage || "",
      status: doc.status,
      createdAt: doc.createdAt
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.warn("GET /api/reviews fallback active:", error);
    return NextResponse.json(INITIAL_REVIEWS);
  }
}

export async function POST(req: Request) {
  try {
    // Rate limit: max 1 submission every 10 seconds per IP
    const clientIp = req.headers.get("x-forwarded-for") || "client-local";
    const lastRequest = rateLimitMap.get(clientIp);
    const now = Date.now();
    if (lastRequest && now - lastRequest < 10000) {
      return NextResponse.json(
        { error: "Please wait 10 seconds before submitting another review." },
        { status: 429 }
      );
    }
    rateLimitMap.set(clientIp, now);

    const body = await req.json();
    let { reviewerName, eventId, eventName, city, rating, reviewText, eventImage } = body;

    if (!reviewerName || !reviewText || !eventId) {
      return NextResponse.json(
        { error: "Reviewer name, event selection, and review text are required." },
        { status: 400 }
      );
    }

    // Auto-fill details from event catalog if available
    const catalogItem = EVENT_CATALOG[eventId];
    if (catalogItem) {
      eventName = eventName || catalogItem.eventName;
      city = city || catalogItem.city;
      eventImage = eventImage || catalogItem.eventImage;
    }

    // Fallbacks
    city = city || "Bangalore";
    eventName = eventName || "NaCl Gathering";
    rating = Math.min(5, Math.max(1, Number(rating) || 5));

    // Sanitize and cap length
    reviewerName = sanitizeInput(String(reviewerName).trim().slice(0, 50));
    eventName = sanitizeInput(String(eventName).trim().slice(0, 100));
    reviewText = sanitizeInput(String(reviewText).trim().slice(0, 1000));

    try {
      const conn = await dbConnect();
      if (conn) {
        const doc = await Review.create({
          reviewerName,
          eventId,
          eventName,
          city,
          rating,
          reviewText,
          eventImage: eventImage || "",
          status: "published"
        });

        const formatted = {
          id: doc._id.toString(),
          reviewerName: doc.reviewerName,
          eventId: doc.eventId,
          eventName: doc.eventName,
          city: doc.city,
          rating: doc.rating,
          reviewText: doc.reviewText,
          eventImage: doc.eventImage,
          status: doc.status,
          createdAt: doc.createdAt
        };

        return NextResponse.json(formatted, { status: 201 });
      }
    } catch (dbErr) {
      console.warn("MongoDB write fallback triggered for review:", dbErr);
    }

    // Offline fallback response
    const fallbackReview = {
      id: "rev-" + Date.now(),
      reviewerName,
      eventId,
      eventName,
      city,
      rating,
      reviewText,
      eventImage: eventImage || "",
      status: "published",
      createdAt: new Date().toISOString()
    };

    return NextResponse.json(fallbackReview, { status: 201 });
  } catch (error) {
    console.error("POST /api/reviews error:", error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const clearAll = searchParams.get("clearAll");

    try {
      const conn = await dbConnect();
      if (conn) {
        if (clearAll === "true") {
          await Review.deleteMany({});
          return NextResponse.json({ success: true, message: "All reviews cleared" });
        }
        if (id) {
          if (id.length === 24) {
            await Review.findByIdAndDelete(id);
          } else {
            await Review.deleteMany({ _id: id });
          }
          return NextResponse.json({ success: true, message: "Review deleted successfully" });
        }
      }
    } catch (dbErr) {
      console.warn("MongoDB delete fallback for review:", dbErr);
    }

    return NextResponse.json({ success: true, message: "Action processed" });
  } catch (error) {
    console.error("DELETE /api/reviews error:", error);
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}
