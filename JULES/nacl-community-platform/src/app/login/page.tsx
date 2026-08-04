"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid credentials");
    } else {
      router.push("/admin"); // Redirect to admin or user dashboard based on role later
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 bg-[#0D0D0D]">
      <form onSubmit={handleSubmit} className="bg-[#1A1A1A] p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <h2 className="text-3xl font-bold mb-6 text-[#F7F5F2]">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-[#D9D9D9] mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#0D0D0D] border border-[#333] text-[#F7F5F2] focus:border-[#FF6B35] focus:outline-none"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-[#D9D9D9] mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#0D0D0D] border border-[#333] text-[#F7F5F2] focus:border-[#FF6B35] focus:outline-none"
            required
          />
        </div>
        <button type="submit" className="w-full bg-[#FF6B35] text-white p-3 rounded-lg font-bold hover:bg-orange-600 transition-colors">
          Sign In
        </button>
        <p className="mt-4 text-center text-[#D9D9D9]">
          Don't have an account? <a href="/register" className="text-[#FF6B35]">Register</a>
        </p>
      </form>
    </div>
  );
}