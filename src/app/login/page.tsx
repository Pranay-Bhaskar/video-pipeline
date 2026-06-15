/*
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, MapPin, Loader2 } from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) { setError(data.error); return; }
      login(data.data.user);
      if (data.data.user.role === "ADMIN") router.push("/admin");
      else router.push("/");
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col bg-[#0d0d16]">
      {/* Hero *}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8">
        <div className="w-14 h-14 rounded-2xl bg-[#7c3aed] flex items-center justify-center mb-5 shadow-lg shadow-purple-900/40">
          <MapPin className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
        <p className="text-sm text-[#9ca3af] mb-8">Sign in to explore Karnataka</p>

        {error && (
          <div className="w-full bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3 text-sm text-rose-400 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div>
            <label className="text-xs font-medium text-[#9ca3af] mb-1.5 block">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              className="w-full bg-[#161622] border border-[#2a2a3e] rounded-xl px-4 py-3.5 text-sm text-white placeholder-[#555577] focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] transition-all"
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[#9ca3af] mb-1.5 block">Password</label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-[#161622] border border-[#2a2a3e] rounded-xl px-4 py-3.5 pr-12 text-sm text-white placeholder-[#555577] focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555577] hover:text-[#9ca3af] p-1"
              >
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] active:scale-[0.98] text-white font-semibold py-3.5 rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : "Sign in"}
          </button>
        </form>
      </div>

      <div className="pb-10 px-6 text-center">
        <p className="text-sm text-[#555577]">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-[#a78bfa] font-medium hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
*/


"use client";


import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, MapPin, Loader2 } from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";
import { cn } from "@/lib/utils";


export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) { setError(data.error); return; }
      login(data.data.user);
      if (data.data.user.role === "ADMIN") router.push("/admin");
      else router.push("/");
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-dvh flex flex-col bg-[#000000]">
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8">
        <div className="w-14 h-14 rounded-2xl bg-white border border-[#2a2a2a] flex items-center justify-center mb-5 shadow-lg shadow-black/40">
          <MapPin className="w-7 h-7 text-black" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
        <p className="text-sm text-[#a1a1a1] mb-8">Sign in to explore Karnataka</p>


        {error && (
          <div className="w-full bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3 text-sm text-rose-400 mb-4">
            {error}
          </div>
        )}


        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div>
            <label className="text-xs font-medium text-[#a1a1a1] mb-1.5 block">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              className="w-full bg-[#111111] border border-[#2a2a2a] rounded-xl px-4 py-3.5 text-sm text-white placeholder-[#6e6e6e] focus:border-white focus:ring-1 focus:ring-white transition-all"
              required
            />
          </div>


          <div>
            <label className="text-xs font-medium text-[#a1a1a1] mb-1.5 block">Password</label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-[#111111] border border-[#2a2a2a] rounded-xl px-4 py-3.5 pr-12 text-sm text-white placeholder-[#6e6e6e] focus:border-white focus:ring-1 focus:ring-white transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6e6e6e] hover:text-[#a1a1a1] p-1"
              >
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>


          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white hover:bg-[#f5f5f5] active:scale-[0.98] text-black font-semibold py-3.5 rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : "Sign in"}
          </button>
        </form>
      </div>


      <div className="pb-10 px-6 text-center">
        <p className="text-sm text-[#6e6e6e]">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-white font-medium hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}