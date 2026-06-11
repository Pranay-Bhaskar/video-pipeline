"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { IVideo } from "@/types";
import { VideoCard } from "@/features/feed/VideoCard";
import { BottomNav } from "@/components/layout/BottomNav";

export default function HomePage() {
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const loadingMore = useRef(false);

  const fetchVideos = useCallback(async (p: number) => {
    if (loadingMore.current) return;
    loadingMore.current = true;
    try {
      const res = await fetch(`/api/videos?page=${p}&limit=5`);
      const data = await res.json();
      if (data.success) {
        setVideos((prev) => p === 1 ? data.data.videos : [...prev, ...data.data.videos]);
        setHasMore(data.data.hasMore);
      }
    } finally {
      setLoading(false);
      loadingMore.current = false;
    }
  }, []);

  useEffect(() => { fetchVideos(1); }, [fetchVideos]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute("data-index") || "0");
            setActiveIndex(index);
            if (index >= videos.length - 2 && hasMore) {
              setPage((p) => { const next = p + 1; fetchVideos(next); return next; });
            }
          }
        });
      },
      { root: container, threshold: 0.6 }
    );
    const items = container.querySelectorAll("[data-index]");
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [videos, hasMore, fetchVideos]);

  if (loading) {
    return (
      <div className="h-dvh flex flex-col items-center justify-center bg-[#0d0d16]">
        <div className="w-14 h-14 rounded-2xl bg-[#7c3aed] flex items-center justify-center mb-4">
          <MapPin className="w-7 h-7 text-white" />
        </div>
        <p className="text-sm text-[#9ca3af]">Loading stories...</p>
        <Loader2 className="w-5 h-5 text-[#7c3aed] animate-spin mt-3" />
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="h-dvh flex flex-col items-center justify-center bg-[#0d0d16] px-8 text-center">
        <div className="text-5xl mb-4">🌿</div>
        <h2 className="text-lg font-bold text-white mb-2">No stories yet</h2>
        <p className="text-sm text-[#9ca3af]">Be the first to share an incredible Karnataka story</p>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="relative h-dvh bg-black">
      <div ref={containerRef} className="h-dvh overflow-y-scroll" style={{ scrollSnapType: "y mandatory" }}>
        {videos.map((video, index) => (
          <div key={video._id} data-index={index} style={{ scrollSnapAlign: "start", scrollSnapStop: "always" }}>
            <VideoCard video={video} isActive={index === activeIndex} />
          </div>
        ))}
        {!hasMore && (
          <div className="h-dvh flex items-center justify-center bg-[#0d0d16]" style={{ scrollSnapAlign: "start" }}>
            <div className="text-center">
              <div className="text-4xl mb-3">🎬</div>
              <p className="text-white font-semibold">You have seen it all</p>
              <p className="text-sm text-[#9ca3af] mt-1">Check back for new stories</p>
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
