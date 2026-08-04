import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CursorTrail from "@/components/layout/CursorTrail";
import { SoundProvider } from "@/components/layout/SoundContext";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "NACL | Movement. Community. Discovery. Energy.",
    template: "%s | NACL",
  },
  description: "A premium members-only culture club. Curated experiences for movement, creativity, wellness and connection in Bangalore, Mumbai, and Coimbatore.",
  keywords: ["NaCl Flowclub", "Steel Mace Flow", "Animal Flow", "Movement Intensive", "Sauna Social", "Cold Plunge", "Wellness Club"],
  authors: [{ name: "NaCl Active Panel" }],
  metadataBase: new URL("https://nacl.in"),
  openGraph: {
    title: "NACL | Movement. Community. Discovery. Energy.",
    description: "Curated experiences for steel mace flow, joint control, animal movement, sauna, and genuine human connection.",
    url: "https://nacl.in",
    siteName: "NACL Culture Club",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://wwpiutgexsehvoqicydp.supabase.co/storage/v1/object/public/event-images/user_3ELaY1WvidCusp6N022FRw0w6bR/1780583942070-d2297891.png",
        width: 1200,
        height: 630,
        alt: "NACL Movement & Experience Club",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NACL | Movement & Culture Club",
    description: "Curated experiences for movement, creativity, wellness and connection.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

import PetAssistant from "@/components/layout/PetAssistant";
import ExitIntentPopup from "@/components/common/ExitIntentPopup";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsClub",
    "name": "NACL Active Culture Club",
    "url": "https://nacl.in",
    "description": "Curated experiences for steel mace flow, joint control, animal movement, and wellness.",
    "location": [
      { "@type": "Place", "name": "Fit District, Indiranagar, Bangalore" },
      { "@type": "Place", "name": "The Nest Gym, Bandra, Mumbai" },
      { "@type": "Place", "name": "Race Course Walkway, Coimbatore" }
    ]
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-primary text-secondary selection:bg-accent selection:text-primary`}>
        <SoundProvider>
          <div className="relative flex min-h-screen flex-col">
            <CursorTrail />
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <PetAssistant />
            <ExitIntentPopup />
          </div>
        </SoundProvider>
      </body>
    </html>
  );
}
