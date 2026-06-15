/*
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, MapPin, Loader2, Compass, Camera } from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";
import { cn } from "@/lib/utils";

type Role = "EXPLORER" | "CREATOR";

const ROLES = [
  {
    value: "EXPLORER" as Role,
    icon: Compass,
    title: "Explorer",
    desc: "Discover and save hidden gems",
  },
  {
    value: "CREATOR" as Role,
    icon: Camera,
    title: "Creator",
    desc: "Upload and share your stories",
  },
];

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({
    fullName: "", email: "", password: "", confirmPassword: "", role: "EXPLORER" as Role,
  });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) { setError(data.error); return; }
      login(data.data.user);
      router.push("/");
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col bg-[#0d0d16] overflow-y-auto">
      <div className="flex-1 px-6 pt-16 pb-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#7c3aed] flex items-center justify-center mb-4 shadow-lg shadow-purple-900/40">
            <MapPin className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Incredible Karnataka</h1>
          <p className="text-sm text-[#9ca3af]">Create your account</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3 text-sm text-rose-400 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role picker *}
          <div>
            <label className="text-xs font-medium text-[#9ca3af] mb-2 block">I want to</label>
            <div className="grid grid-cols-2 gap-3">
              {ROLES.map(({ value, icon: Icon, title, desc }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm({ ...form, role: value })}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all text-left",
                    form.role === value
                      ? "bg-[#7c3aed]/15 border-[#7c3aed] text-white"
                      : "bg-[#161622] border-[#2a2a3e] text-[#9ca3af]"
                  )}
                >
                  <Icon className={cn("w-6 h-6", form.role === value ? "text-[#a78bfa]" : "text-[#555577]")} />
                  <div>
                    <div className="text-sm font-semibold text-center">{title}</div>
                    <div className="text-[10px] text-[#6b7280] text-center mt-0.5">{desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[#9ca3af] mb-1.5 block">Full name</label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="Arjun Sharma"
              className="w-full bg-[#161622] border border-[#2a2a3e] rounded-xl px-4 py-3.5 text-sm text-white placeholder-[#555577] focus:border-[#7c3aed] transition-all"
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[#9ca3af] mb-1.5 block">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              className="w-full bg-[#161622] border border-[#2a2a3e] rounded-xl px-4 py-3.5 text-sm text-white placeholder-[#555577] focus:border-[#7c3aed] transition-all"
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
                placeholder="Min 8 chars, uppercase + number"
                className="w-full bg-[#161622] border border-[#2a2a3e] rounded-xl px-4 py-3.5 pr-12 text-sm text-white placeholder-[#555577] focus:border-[#7c3aed] transition-all"
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

          <div>
            <label className="text-xs font-medium text-[#9ca3af] mb-1.5 block">Confirm password</label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              placeholder="Repeat password"
              className="w-full bg-[#161622] border border-[#2a2a3e] rounded-xl px-4 py-3.5 text-sm text-white placeholder-[#555577] focus:border-[#7c3aed] transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] active:scale-[0.98] text-white font-semibold py-3.5 rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</> : "Create account"}
          </button>
        </form>

        <p className="text-sm text-[#555577] text-center mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-[#a78bfa] font-medium hover:underline">
            Sign in
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
import { Eye, EyeOff, MapPin, Loader2, Compass, Camera } from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";
import { cn } from "@/lib/utils";


type Role = "EXPLORER" | "CREATOR";


const ROLES = [
  {
    value: "EXPLORER" as Role,
    icon: Compass,
    title: "Explorer",
    desc: "Discover and save hidden gems",
  },
  {
    value: "CREATOR" as Role,
    icon: Camera,
    title: "Creator",
    desc: "Upload and share your stories",
  },
];


export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({
    fullName: "", email: "", password: "", confirmPassword: "", role: "EXPLORER" as Role,
  });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) { setError(data.error); return; }
      login(data.data.user);
      router.push("/");
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-dvh flex flex-col bg-[#000000] overflow-y-auto">
      <div className="flex-1 px-6 pt-16 pb-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-white border border-[#2a2a2a] flex items-center justify-center mb-4 shadow-lg shadow-black/40">
            <MapPin className="w-7 h-7 text-black" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Incredible Karnataka</h1>
          <p className="text-sm text-[#a1a1a1]">Create your account</p>
        </div>


        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3 text-sm text-rose-400 mb-4">
            {error}
          </div>
        )}


        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-[#a1a1a1] mb-2 block">I want to</label>
            <div className="grid grid-cols-2 gap-3">
              {ROLES.map(({ value, icon: Icon, title, desc }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm({ ...form, role: value })}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all text-left",
                    form.role === value
                      ? "bg-white border-white text-black"
                      : "bg-[#111111] border-[#2a2a2a] text-[#a1a1a1]"
                  )}
                >
                  <Icon className={cn("w-6 h-6", form.role === value ? "text-black" : "text-[#6e6e6e]")} />
                  <div>
                    <div className="text-sm font-semibold text-center">{title}</div>
                    <div className="text-[10px] text-[#6e6e6e] text-center mt-0.5">{desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>


          <div>
            <label className="text-xs font-medium text-[#a1a1a1] mb-1.5 block">Full name</label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="Arjun Sharma"
              className="w-full bg-[#111111] border border-[#2a2a2a] rounded-xl px-4 py-3.5 text-sm text-white placeholder-[#6e6e6e] focus:border-white transition-all"
              required
            />
          </div>


          <div>
            <label className="text-xs font-medium text-[#a1a1a1] mb-1.5 block">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              className="w-full bg-[#111111] border border-[#2a2a2a] rounded-xl px-4 py-3.5 text-sm text-white placeholder-[#6e6e6e] focus:border-white transition-all"
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
                placeholder="Min 8 chars, uppercase + number"
                className="w-full bg-[#111111] border border-[#2a2a2a] rounded-xl px-4 py-3.5 pr-12 text-sm text-white placeholder-[#6e6e6e] focus:border-white transition-all"
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


          <div>
            <label className="text-xs font-medium text-[#a1a1a1] mb-1.5 block">Confirm password</label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              placeholder="Repeat password"
              className="w-full bg-[#111111] border border-[#2a2a2a] rounded-xl px-4 py-3.5 text-sm text-white placeholder-[#6e6e6e] focus:border-white transition-all"
              required
            />
          </div>


          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white hover:bg-[#f5f5f5] active:scale-[0.98] text-black font-semibold py-3.5 rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</> : "Create account"}
          </button>
        </form>


        <p className="text-sm text-[#6e6e6e] text-center mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-white font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}