"use client";

import { CheckCircle, XCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToastItem {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

export function ToastContainer({ toasts }: { toasts: ToastItem[] }) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 w-[calc(100%-32px)] max-w-[398px]">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-sm font-medium animate-in slide-in-from-bottom-2",
            t.type === "success" && "bg-emerald-600 text-white",
            t.type === "error" && "bg-rose-600 text-white",
            t.type === "info" && "bg-[#1e1e2e] border border-[#2a2a3e] text-white"
          )}
        >
          {t.type === "success" && <CheckCircle className="w-4 h-4 flex-shrink-0" />}
          {t.type === "error" && <XCircle className="w-4 h-4 flex-shrink-0" />}
          {t.type === "info" && <Info className="w-4 h-4 flex-shrink-0" />}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
