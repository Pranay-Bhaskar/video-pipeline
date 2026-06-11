"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LogOut, Settings, MapPin, Video, Bookmark,
  Clock, CheckCircle, XCircle, ChevronRight,
  User, Shield, Camera
} from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";
import { IVideo } from "@/types";
import { VIDEO_STATUS, CATEGORIES } from "@/constants";
import { formatRelativeTime, cn } from "@/lib/utils";
import { BottomNav } from "@/components/layout/BottomNav";

type Tab = "all" | "PENDING" | "APPROVED" | "REJECTED";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [videosLoading, setVideosLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("all");

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.role === "CREATOR") fetchMyVideos();
  }, [user]);

  const fetchMyVideos = async (status?: string) => {
    setVideosLoading(true);
    try {
      const url = status ? `/api/videos/my-videos?status=${status}` : "/api/videos/my-videos";
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) setVideos(data.data.videos);
    } finally {
      setVideosLoading(false);
    }
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    fetchMyVideos(tab === "all" ? undefined : tab);
  };

  if (loading || !user) {
    return (
      <div className="h-dvh flex items-center justify-center bg-[#0d0d16]">
        <div className="w-8 h-8 border-2 border-[#7c3aed] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const counts = {
    all: videos.length,
    PENDING: videos.filter((v) => v.status === "PENDING").length,
    APPROVED: videos.filter((v) => v.status === "APPROVED").length,
    REJECTED: videos.filter((v) => v.status === "REJECTED").length,
  };

  return (
    <div className="min-h-dvh bg-[#0d0d16] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#120827] to-[#0d0d16] px-4 pt-14 pb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7c3aed] to-[#4c1d95] flex items-center justify-center text-xl font-bold text-white border-2 border-[#7c3aed]/30">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">{user.fullName}</h1>
              <p className="text-xs text-[#9ca3af] mt-0.5">{user.email}</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <RoleBadge role={user.role} />
                {user.district && (
                  <span className="flex items-center gap-1 text-[10px] text-[#6b7280] bg-[#1e1e2e] px-2 py-0.5 rounded-full">
                    <MapPin className="w-2.5 h-2.5" />
                    {user.district}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-9 h-9 rounded-xl bg-[#1e1e2e] flex items-center justify-center"
          >
            <LogOut className="w-4 h-4 text-[#9ca3af]" />
          </button>
        </div>

        {/* Stats row - creator only */}
        {user.role === "CREATOR" && (
          <div className="grid grid-cols-3 gap-2 mt-4">
            <StatCard value={counts.APPROVED} label="Published" color="text-emerald-400" />
            <StatCard value={counts.PENDING} label="Pending" color="text-amber-400" />
            <StatCard value={counts.REJECTED} label="Rejected" color="text-rose-400" />
          </div>
        )}
      </div>

      {/* Creator video tabs */}
      {user.role === "CREATOR" && (
        <div className="px-4">
          {/* Tab bar */}
          <div className="flex bg-[#161622] rounded-2xl p-1 gap-1 mb-4">
            {(["all", "APPROVED", "PENDING", "REJECTED"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={cn(
                  "flex-1 py-2 rounded-xl text-xs font-medium transition-all",
                  activeTab === tab
                    ? "bg-[#7c3aed] text-white"
                    : "text-[#555577] hover:text-white"
                )}
              >
                {tab === "all" ? "All" : tab.charAt(0) + tab.slice(1).toLowerCase()}
                {" "}
                <span className="opacity-60">({counts[tab]})</span>
              </button>
            ))}
          </div>

          {/* Video list */}
          {videosLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 skeleton rounded-xl" />
              ))}
            </div>
          ) : videos.length === 0 ? (
            <EmptyVideos tab={activeTab} />
          ) : (
            <div className="space-y-3">
              {videos.map((video) => (
                <VideoListItem key={video._id} video={video} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Explorer menu */}
      {user.role === "EXPLORER" && (
        <div className="px-4 space-y-2">
          <p className="text-xs font-medium text-[#555577] mb-3 mt-2">MY CONTENT</p>
          <MenuItem icon={Bookmark} label="Saved places" sub="0 saved" onClick={() => {}} />
          <MenuItem icon={Video} label="Saved videos" sub="0 videos" onClick={() => {}} />

          <p className="text-xs font-medium text-[#555577] mb-3 mt-5">ACCOUNT</p>
          <MenuItem icon={Settings} label="Settings" sub="Preferences & notifications" onClick={() => {}} />
          <MenuItem
            icon={LogOut}
            label="Sign out"
            sub="Log out of your account"
            onClick={logout}
            danger
          />
        </div>
      )}

      {/* Creator menu - settings only */}
      {user.role === "CREATOR" && (
        <div className="px-4 mt-6 space-y-2">
          <p className="text-xs font-medium text-[#555577] mb-3">ACCOUNT</p>
          <MenuItem icon={Settings} label="Settings" sub="Preferences & notifications" onClick={() => {}} />
          <MenuItem
            icon={LogOut}
            label="Sign out"
            sub="Log out of your account"
            onClick={logout}
            danger
          />
        </div>
      )}

      <BottomNav />
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const configs = {
    EXPLORER: { icon: User, label: "Explorer", cls: "bg-blue-500/15 text-blue-400 border-blue-500/20" },
    CREATOR: { icon: Camera, label: "Creator", cls: "bg-purple-500/15 text-purple-400 border-purple-500/20" },
    ADMIN: { icon: Shield, label: "Admin", cls: "bg-rose-500/15 text-rose-400 border-rose-500/20" },
  };
  const cfg = configs[role as keyof typeof configs];
  if (!cfg) return null;
  return (
    <span className={cn("flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border", cfg.cls)}>
      <cfg.icon className="w-2.5 h-2.5" />
      {cfg.label}
    </span>
  );
}

function StatCard({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="bg-[#161622] rounded-xl p-3 text-center border border-[#2a2a3e]">
      <div className={cn("text-xl font-bold", color)}>{value}</div>
      <div className="text-[10px] text-[#555577] mt-0.5">{label}</div>
    </div>
  );
}

function VideoListItem({ video }: { video: IVideo }) {
  const status = VIDEO_STATUS[video.status];
  const category = CATEGORIES.find((c) => c.value === video.category);
  const StatusIcon =
    video.status === "APPROVED" ? CheckCircle :
    video.status === "REJECTED" ? XCircle : Clock;

  return (
    <div className="bg-[#161622] rounded-2xl border border-[#2a2a3e] overflow-hidden flex">
      {/* Thumbnail / placeholder */}
      <div className="w-20 h-20 bg-[#1e1e2e] flex-shrink-0 relative">
        {video.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={video.thumbnailUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Video className="w-6 h-6 text-[#2a2a3e]" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Info */}
      <div className="flex-1 p-3 min-w-0">
        <p className="text-sm font-semibold text-white truncate leading-tight">{video.title}</p>
        <div className="flex items-center gap-1.5 mt-1">
          <MapPin className="w-3 h-3 text-[#555577]" />
          <span className="text-[11px] text-[#555577] truncate">{video.placeName}, {video.district}</span>
        </div>
        {category && (
          <span className="text-[10px] text-[#555577] mt-0.5 block">{category.emoji} {category.label}</span>
        )}
        <div className="flex items-center justify-between mt-2">
          <div className={cn("flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full", status.bg, status.color)}>
            <StatusIcon className="w-2.5 h-2.5" />
            {status.label}
          </div>
          <span className="text-[10px] text-[#555577]">{formatRelativeTime(video.createdAt)}</span>
        </div>
        {video.status === "REJECTED" && video.rejectionReason && (
          <p className="text-[10px] text-rose-400 mt-1 line-clamp-1">Reason: {video.rejectionReason}</p>
        )}
      </div>
    </div>
  );
}

function MenuItem({
  icon: Icon, label, sub, onClick, danger = false
}: {
  icon: React.ElementType;
  label: string;
  sub: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-[#161622] rounded-2xl border border-[#2a2a3e] px-4 py-3.5 flex items-center gap-3 active:opacity-70 transition-all"
    >
      <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center",
        danger ? "bg-rose-500/10" : "bg-[#1e1e2e]"
      )}>
        <Icon className={cn("w-4.5 h-4.5", danger ? "text-rose-400" : "text-[#a78bfa]")} style={{ width: 18, height: 18 }} />
      </div>
      <div className="flex-1 text-left">
        <p className={cn("text-sm font-medium", danger ? "text-rose-400" : "text-white")}>{label}</p>
        <p className="text-xs text-[#555577] mt-0.5">{sub}</p>
      </div>
      {!danger && <ChevronRight className="w-4 h-4 text-[#2a2a3e]" />}
    </button>
  );
}

function EmptyVideos({ tab }: { tab: Tab }) {
  const msgs: Record<Tab, { emoji: string; title: string; sub: string }> = {
    all: { emoji: "🎬", title: "No videos yet", sub: "Upload your first Karnataka story" },
    PENDING: { emoji: "⏳", title: "No pending videos", sub: "All submissions have been reviewed" },
    APPROVED: { emoji: "✅", title: "No approved videos", sub: "Keep uploading — great content gets approved!" },
    REJECTED: { emoji: "❌", title: "No rejected videos", sub: "Looking good!" },
  };
  const m = msgs[tab];
  return (
    <div className="py-16 flex flex-col items-center text-center">
      <div className="text-4xl mb-3">{m.emoji}</div>
      <p className="text-sm font-semibold text-white">{m.title}</p>
      <p className="text-xs text-[#555577] mt-1">{m.sub}</p>
    </div>
  );
}
