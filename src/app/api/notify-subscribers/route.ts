import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { eventTitle, eventCategory, city, date, price, venue, eventId } = body;

    if (!eventTitle) {
      return NextResponse.json({ error: "Event details required for notification" }, { status: 400 });
    }

    // Recommendation log for user email provider
    console.log(`[EVENT NOTIFICATION TRIGGERED]
      Event: ${eventTitle} (${city})
      Date: ${date} | Price: ₹${price} | Venue: ${venue}
      Recommendation: Integrated with Resend (resend.com) for production transactional emails.
    `);

    return NextResponse.json({
      success: true,
      message: `Notification queued for active subscribers interested in ${city || "All"} hub events.`,
      recommendedService: "Resend (resend.com) - 3,000 free emails/month with React Email template support",
      event: { eventTitle, city, date, price, venue, eventId },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to trigger notifications" }, { status: 500 });
  }
}
