"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "", description: "", date: "", location: "", category: "Movement", image: "", price: 0, capacity: 100
  });

  useEffect(() => {
    if (status === "unauthenticated" || (session?.user as any)?.role !== "admin") {
      router.push("/login");
    }
  }, [status, session, router]);

  if (status === "loading" || (session?.user as any)?.role !== "admin") {
    return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      alert("Event created successfully!");
      setFormData({ title: "", description: "", date: "", location: "", category: "Movement", image: "", price: 0, capacity: 100 });
    } else {
      alert("Failed to create event");
    }
  };

  return (
    <div className="min-h-screen pt-32 px-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-[#FF6B35]">Admin Dashboard</h1>
      <div className="bg-[#1A1A1A] p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold mb-6">Create New Event</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input type="text" placeholder="Title" required className="p-3 rounded bg-[#0D0D0D] border border-[#333]" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          <input type="text" placeholder="Date (e.g. Sat Jun 27th @ 10:30 AM)" required className="p-3 rounded bg-[#0D0D0D] border border-[#333]" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
          <input type="text" placeholder="Location" required className="p-3 rounded bg-[#0D0D0D] border border-[#333]" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
          <select className="p-3 rounded bg-[#0D0D0D] border border-[#333]" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
            <option>Movement</option><option>Wellness</option><option>Creative</option><option>Social</option>
          </select>
          <input type="text" placeholder="Image URL" required className="p-3 rounded bg-[#0D0D0D] border border-[#333]" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
          <input type="number" placeholder="Price (₹)" required className="p-3 rounded bg-[#0D0D0D] border border-[#333]" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
          <textarea placeholder="Description" className="p-3 rounded bg-[#0D0D0D] border border-[#333] md:col-span-2" rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
          <button type="submit" className="md:col-span-2 bg-[#FF6B35] text-white p-3 rounded font-bold hover:bg-orange-600">Create Event</button>
        </form>
      </div>
    </div>
  );
}