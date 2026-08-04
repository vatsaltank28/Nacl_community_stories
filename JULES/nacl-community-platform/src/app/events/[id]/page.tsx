"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { use, useState } from "react";

const mockEvent = {
  _id: "rawform-lab",
  title: "NaCl Flow Club: RawForm Lab",
  date: "Sat Jun 27th @ 10:30 AM IST",
  location: "Fit District, Bengaluru",
  category: "Movement",
  image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=1000&auto=format&fit=crop",
  price: 1499,
  description: "Curated experiences for movement, creativity, wellness and connection. Join us for an immersive session designed to help you find your flow state."
};

export default function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // In a real app, you would fetch the event from MongoDB using the ID
  const event = mockEvent;

  const handleCheckout = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event._id,
          title: event.title,
          price: event.price
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error(error);
      alert("Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-8 max-w-5xl mx-auto">
      <div className="relative h-96 w-full rounded-3xl overflow-hidden mb-12">
        <Image src={event.image} alt={event.title} fill className="object-cover" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2">
          <div className="inline-block px-4 py-1 bg-[#FF6B35]/20 text-[#FF6B35] rounded-full text-sm font-bold mb-4">
            {event.category}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{event.title}</h1>
          <p className="text-xl text-[#D9D9D9] mb-8 leading-relaxed">
            {event.description}
          </p>
          
          <div className="bg-[#1A1A1A] p-6 rounded-2xl mb-8">
            <h3 className="text-xl font-bold mb-4">Location</h3>
            <p className="text-[#D9D9D9]">{event.location}</p>
          </div>
        </div>

        <div className="bg-[#1A1A1A] p-8 rounded-2xl h-fit sticky top-32">
          <h3 className="text-2xl font-bold mb-2">₹{event.price}</h3>
          <p className="text-[#D9D9D9] mb-6">{event.date}</p>
          <button 
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-[#FF6B35] text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            {loading ? "Processing..." : "Buy Ticket"}
          </button>
          <p className="text-xs text-center text-[#D9D9D9] mt-4">Secure payment powered by Stripe</p>
        </div>
      </div>
    </div>
  );
}