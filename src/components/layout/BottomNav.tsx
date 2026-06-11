"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Upload, Bookmark, User } from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/search", icon: Search, label: "Search" },
  { href: "/upload", icon: Upload, label: "Upload", creatorOnly: true },
  { href: "/saved", icon: Bookmark, label: "Saved" },
  { href: "/profile", icon: User, label: "Profile" },
];

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.creatorOnly || user?.role === "CREATOR"
  );

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-[#0d0d16]/95 backdrop-blur-md border-t border-[#2a2a3e] z-50">
      <div className="flex items-center justify-around px-2 py-2 pb-safe">
        {visibleItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          const isUpload = href === "/upload";
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all",
                isUpload && "relative"
              )}
            >
              {isUpload ? (
                <div className="w-12 h-12 rounded-2xl bg-[#7c3aed] flex items-center justify-center shadow-lg shadow-purple-900/40 -mt-5">
                  <Icon className="w-5 h-5 text-white" />
                </div>
              ) : (
                <>
                  <Icon
                    className={cn(
                      "w-6 h-6 transition-all",
                      isActive ? "text-[#a78bfa]" : "text-[#555577]"
                    )}
                  />
                  <span
                    className={cn(
                      "text-[10px] font-medium transition-all",
                      isActive ? "text-[#a78bfa]" : "text-[#555577]"
                    )}
                  >
                    {label}
                  </span>
                </>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
