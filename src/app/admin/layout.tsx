"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Video, LogOut, Shield } from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";
import { cn } from "@/lib/utils";

const ADMIN_NAV = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/videos", icon: Video, label: "Videos" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && (!user || user.role !== "ADMIN")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="h-dvh flex items-center justify-center bg-[#080c18]">
        <div className="w-8 h-8 border-2 border-[#60a5fa] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#080c18] flex flex-col">
      {/* Admin top bar */}
      <div className="flex items-center justify-between px-4 pt-12 pb-3 border-b border-[#0f172a] bg-[#080c18]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#1e40af] flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white leading-tight">Admin Console</h1>
            <p className="text-[10px] text-[#475569]">Incredible Karnataka</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 text-xs text-[#475569] hover:text-white transition-colors px-3 py-1.5 rounded-xl bg-[#0f172a]"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign out
        </button>
      </div>

      {/* Page content */}
      <div className="flex-1 overflow-y-auto pb-20">{children}</div>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-[#080c18]/95 backdrop-blur-md border-t border-[#0f172a] z-50">
        <div className="flex items-center justify-around py-3 pb-safe">
          {ADMIN_NAV.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-1"
              >
                <Icon className={cn("w-5 h-5 transition-all", isActive ? "text-[#60a5fa]" : "text-[#334155]")} />
                <span className={cn("text-[10px] font-medium", isActive ? "text-[#60a5fa]" : "text-[#334155]")}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
