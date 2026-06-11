"use client";

import { useRef, useEffect, useState } from "react";
import {
  Heart, MessageCircle, Share2, Bookmark, MapPin,
  Volume2, VolumeX, Play, UserCircle2, MoreVertical
} from "lucide-react";
import { IVideo } from "@/types";
import { formatCount, formatRelativeTime, cn } from "@/lib/utils";
import { CATEGORIES } from "@/constants";

interface VideoCardProps {
  video: IVideo;
  isActive: boolean;
}

export function VideoCard({ video, isActive }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);
  const [showPlayIcon, setShowPlayIcon] = useState(false);
  const creator = typeof video.creatorId === "object" ? video.creatorId : null;
  const category = CATEGORIES.find((c) => c.value === video.category);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (isActive) {
      vid.currentTime = 0;
      vid.play().catch(() => {});
      setPaused(false);
    } else {
      vid.pause();
    }
  }, [isActive]);

  const togglePlay = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) {
      vid.play();
      setPaused(false);
    } else {
      vid.pause();
      setPaused(true);
    }
    setShowPlayIcon(true);
    setTimeout(() => setShowPlayIcon(false), 800);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  return (
    <div className="feed-item relative w-full h-dvh bg-black overflow-hidden">
      {/* Video */}
      <video
        ref={videoRef}
        src={video.videoUrl}
        className="absolute inset-0 w-full h-full object-cover"
        loop
        muted={muted}
        playsInline
        onClick={togglePlay}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

      {/* Play/pause icon flash */}
      {showPlayIcon && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm animate-ping-once">
            {paused ? <Play className="w-8 h-8 text-white fill-white" /> : <Play className="w-8 h-8 text-white fill-white opacity-0" />}
          </div>
        </div>
      )}

      {/* Top: mute + more */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-12 pointer-events-none">
        <div />
        <div className="flex items-center gap-3 pointer-events-auto">
          <button
            onClick={toggleMute}
            className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center"
          >
            {muted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
          </button>
        </div>
      </div>

      {/* Right side actions */}
      <div className="absolute right-3 bottom-28 flex flex-col items-center gap-5">
        {/* Creator avatar */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-white flex items-center justify-center overflow-hidden">
            {creator && typeof creator === "object" && (creator as { profileImage?: string }).profileImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={(creator as { profileImage: string }).profileImage} alt="" className="w-full h-full object-cover" />
            ) : (
              <UserCircle2 className="w-6 h-6 text-white" />
            )}
          </div>
          <div className="w-5 h-5 rounded-full bg-[#7c3aed] flex items-center justify-center -mt-3 border-2 border-black">
            <span className="text-[8px] text-white font-bold">+</span>
          </div>
        </div>

        <ActionBtn icon={Heart} count={video.likesCount} label="Like" />
        <ActionBtn icon={MessageCircle} count={video.commentsCount} label="Comment" />
        <ActionBtn icon={Share2} count={video.sharesCount} label="Share" />
        <ActionBtn icon={Bookmark} count={video.savesCount} label="Save" />
        <button className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <MoreVertical className="w-5 h-5 text-white" />
          </div>
        </button>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-14 px-4 pb-24">
        {/* Creator name */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-white font-semibold text-sm">
            @{creator && typeof creator === "object" ? (creator as { fullName: string }).fullName?.replace(/\s+/g, "").toLowerCase() : "creator"}
          </span>
          {creator && typeof creator === "object" && (creator as { isVerified?: boolean }).isVerified && (
            <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-[8px] text-white font-bold">✓</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className="text-white font-semibold text-base leading-snug mb-2 line-clamp-2">
          {video.title}
        </h2>

        {/* Place + category row */}
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1">
            <MapPin className="w-3 h-3 text-[#a78bfa]" />
            <span className="text-xs text-white">{video.placeName}, {video.district}</span>
          </div>
          {category && (
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-2.5 py-1">
              <span className="text-xs text-white">{category.emoji} {category.label}</span>
            </div>
          )}
        </div>

        {/* Time */}
        <p className="text-[11px] text-white/50 mt-1">{formatRelativeTime(video.createdAt)}</p>
      </div>
    </div>
  );
}

function ActionBtn({
  icon: Icon,
  count,
  label,
}: {
  icon: React.ElementType;
  count: number;
  label: string;
}) {
  const [active, setActive] = useState(false);
  return (
    <button
      onClick={() => setActive(!active)}
      className="flex flex-col items-center gap-1"
    >
      <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
        <Icon className={cn("w-5 h-5", active ? "text-[#a78bfa] fill-[#a78bfa]" : "text-white")} />
      </div>
      <span className="text-white text-xs font-medium">{formatCount(count)}</span>
    </button>
  );
}
