import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email parameter missing" }, { status: 400 });
  }

  return new NextResponse(
    `
    <!Token HTML>
    <html lang="en">
      <head>
        <title>Unsubscribed | NaCl Culture Club</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { background: #0A0A0A; color: #FFFFFF; font-family: sans-serif; display: flex; items: center; justify-content: center; min-height: 100vh; margin: 0; text-align: center; }
          .card { background: #171717; padding: 40px; border-radius: 24px; border: 1px solid rgba(255,85,0,0.3); max-width: 400px; }
          h1 { color: #FF5500; font-size: 24px; margin-bottom: 12px; }
          p { color: #A3A3A3; font-size: 14px; line-height: 1.5; }
          a { color: #FF5500; text-decoration: none; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>You Have Unsubscribed</h1>
          <p>The email address <strong>${email}</strong> has been updated to unsubscribed status. You will no longer receive event notifications.</p>
          <p><a href="/">Return to NaCl Home</a></p>
        </div>
      </body>
    </html>
    `,
    { headers: { "Content-Type": "text/html" } }
  );
}
