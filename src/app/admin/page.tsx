"use client";

import { useEffect, useState } from "react";
import { Video, Clock, CheckCircle, XCircle, TrendingUp, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Stats {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({ pending: 0, approved: 0, rejected: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
          fetch("/api/admin/videos?status=PENDING"),
          fetch("/api/admin/videos?status=APPROVED"),
          fetch("/api/admin/videos?status=REJECTED"),
        ]);
        const [p, a, r] = await Promise.all([pendingRes.json(), approvedRes.json(), rejectedRes.json()]);
        const pending = p.data?.videos?.length || 0;
        const approved = a.data?.videos?.length || 0;
        const rejected = r.data?.videos?.length || 0;
        setStats({ pending, approved, rejected, total: pending + approved + rejected });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="px-4 pt-5 pb-6">
      <h2 className="text-lg font-bold text-white mb-1">Overview</h2>
      <p className="text-xs text-[#475569] mb-5">Platform health at a glance</p>

      {/* Alert if pending */}
      {!loading && stats.pending > 0 && (
        <Link href="/admin/videos">
          <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/25 rounded-2xl p-3.5 mb-5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-4.5 h-4.5 text-amber-400" style={{ width: 18, height: 18 }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-300">
                {stats.pending} video{stats.pending !== 1 ? "s" : ""} awaiting review
              </p>
              <p className="text-xs text-amber-400/70 mt-0.5">Tap to review now →</p>
            </div>
          </div>
        </Link>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <StatCard
          icon={Clock}
          label="Pending"
          value={stats.pending}
          color="text-amber-400"
          bg="bg-amber-500/10"
          loading={loading}
        />
        <StatCard
          icon={CheckCircle}
          label="Approved"
          value={stats.approved}
          color="text-emerald-400"
          bg="bg-emerald-500/10"
          loading={loading}
        />
        <StatCard
          icon={XCircle}
          label="Rejected"
          value={stats.rejected}
          color="text-rose-400"
          bg="bg-rose-500/10"
          loading={loading}
        />
        <StatCard
          icon={Video}
          label="Total Videos"
          value={stats.total}
          color="text-blue-400"
          bg="bg-blue-500/10"
          loading={loading}
        />
      </div>

      {/* Quick actions */}
      <p className="text-xs font-medium text-[#475569] mb-3">QUICK ACTIONS</p>
      <div className="space-y-2">
        <Link href="/admin/videos?status=PENDING">
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 flex items-center gap-3 active:opacity-70">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">Review pending videos</p>
              <p className="text-xs text-[#475569] mt-0.5">{stats.pending} waiting</p>
            </div>
            <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
              <span className="text-[10px] font-bold text-black">{stats.pending}</span>
            </div>
          </div>
        </Link>

        <Link href="/admin/videos?status=APPROVED">
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 flex items-center gap-3 active:opacity-70">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">Published content</p>
              <p className="text-xs text-[#475569] mt-0.5">{stats.approved} live in feed</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon, label, value, color, bg, loading
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
  bg: string;
  loading: boolean;
}) {
  return (
    <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4">
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", bg)}>
        <Icon className={cn("w-5 h-5", color)} />
      </div>
      {loading ? (
        <div className="h-7 w-12 skeleton rounded mb-1" />
      ) : (
        <div className={cn("text-2xl font-bold", color)}>{value}</div>
      )}
      <div className="text-xs text-[#475569] mt-0.5">{label}</div>
    </div>
  );
}
