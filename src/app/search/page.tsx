/*
"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, X, MapPin, Filter } from "lucide-react";
import { IVideo } from "@/types";
import { CATEGORIES, KARNATAKA_DISTRICTS } from "@/constants";
import { cn, formatRelativeTime } from "@/lib/utils";
import { BottomNav } from "@/components/layout/BottomNav";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [district, setDistrict] = useState("");
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const doSearch = useCallback(async () => {
    setLoading(true);
    setSearched(true);
    try {
      const params = new URLSearchParams();
      if (category) params.set("category", category);
      if (district) params.set("district", district);
      params.set("limit", "20");
      const res = await fetch(`/api/videos?${params}`);
      const data = await res.json();
      if (data.success) {
        let results = data.data.videos as IVideo[];
        if (query.trim()) {
          const q = query.toLowerCase();
          results = results.filter(
            (v) =>
              v.title.toLowerCase().includes(q) ||
              v.placeName.toLowerCase().includes(q) ||
              v.description.toLowerCase().includes(q) ||
              v.tags?.some((t) => t.toLowerCase().includes(q))
          );
        }
        setVideos(results);
      }
    } finally {
      setLoading(false);
    }
  }, [query, category, district]);

  // Search on filter change
  useEffect(() => {
    if (category || district) doSearch();
  }, [category, district]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    doSearch();
  };

  const clearAll = () => {
    setQuery("");
    setCategory("");
    setDistrict("");
    setVideos([]);
    setSearched(false);
  };

  return (
    <div className="min-h-dvh bg-[#0d0d16] pb-24">
      {/* Header *}
      <div className="px-4 pt-14 pb-3 border-b border-[#1e1e2e]">
        <h1 className="text-xl font-bold text-white mb-3">Search</h1>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555577]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Places, stories, food..."
              className="w-full bg-[#161622] border border-[#2a2a3e] rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder-[#555577] focus:border-[#7c3aed] transition-all"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-[#555577]" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center border transition-all",
              showFilters || category || district
                ? "bg-[#7c3aed]/15 border-[#7c3aed] text-[#a78bfa]"
                : "bg-[#161622] border-[#2a2a3e] text-[#555577]"
            )}
          >
            <Filter className="w-4 h-4" />
          </button>
        </form>

        {/* Filters *}
        {showFilters && (
          <div className="mt-3 space-y-2">
            {/* Category chips *}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setCategory("")}
                className={cn("flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                  !category ? "bg-[#7c3aed] text-white border-[#7c3aed]" : "bg-[#161622] text-[#9ca3af] border-[#2a2a3e]"
                )}
              >All</button>
              {CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setCategory(category === c.value ? "" : c.value)}
                  className={cn("flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                    category === c.value ? "bg-[#7c3aed] text-white border-[#7c3aed]" : "bg-[#161622] text-[#9ca3af] border-[#2a2a3e]"
                  )}
                >
                  {c.emoji} {c.label}
                </button>
              ))}
            </div>

            {/* District select *}
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full bg-[#161622] border border-[#2a2a3e] rounded-xl px-4 py-2.5 text-sm text-white"
            >
              <option value="">All districts</option>
              {KARNATAKA_DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        )}

        {(category || district || query) && (
          <button onClick={clearAll} className="text-xs text-[#a78bfa] mt-2">Clear all filters</button>
        )}
      </div>

      {/* Results *}
      <div className="px-4 pt-4">
        {!searched && !loading && (
          <div className="py-10 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-sm font-medium text-white mb-1">Explore Karnataka</p>
            <p className="text-xs text-[#555577]">Search places, stories, food trails and hidden gems</p>
            {/* Quick categories *}
            <div className="grid grid-cols-2 gap-2 mt-6">
              {CATEGORIES.slice(0, 6).map((c) => (
                <button
                  key={c.value}
                  onClick={() => setCategory(c.value)}
                  className="bg-[#161622] border border-[#2a2a3e] rounded-xl p-3 text-left"
                >
                  <span className="text-2xl">{c.emoji}</span>
                  <p className="text-xs font-medium text-white mt-1">{c.label}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 skeleton rounded-xl" />
            ))}
          </div>
        )}

        {searched && !loading && videos.length === 0 && (
          <div className="py-16 text-center">
            <div className="text-4xl mb-3">😕</div>
            <p className="text-sm font-medium text-white">No results found</p>
            <p className="text-xs text-[#555577] mt-1">Try different keywords or filters</p>
          </div>
        )}

        {videos.length > 0 && (
          <>
            <p className="text-xs text-[#555577] mb-3">{videos.length} result{videos.length !== 1 ? "s" : ""}</p>
            <div className="space-y-3">
              {videos.map((video) => (
                <SearchResultCard key={video._id} video={video} />
              ))}
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

function SearchResultCard({ video }: { video: IVideo }) {
  const cat = CATEGORIES.find((c) => c.value === video.category);
  const creator = typeof video.creatorId === "object" ? video.creatorId as { fullName: string } : null;

  return (
    <div className="bg-[#161622] rounded-2xl border border-[#2a2a3e] overflow-hidden flex">
      <div className="w-20 h-20 bg-[#1e1e2e] flex-shrink-0">
        {video.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={video.thumbnailUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">
            {cat?.emoji || "🎬"}
          </div>
        )}
      </div>
      <div className="flex-1 p-3 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{video.title}</p>
        <div className="flex items-center gap-1 mt-1">
          <MapPin className="w-3 h-3 text-[#555577]" />
          <span className="text-[11px] text-[#555577] truncate">{video.placeName}, {video.district}</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[10px] text-[#555577]">
            by {creator?.fullName || "Creator"}
          </span>
          <span className="text-[10px] text-[#555577]">{formatRelativeTime(video.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
*/



"use client";


import { useState, useEffect, useCallback } from "react";
import { Search, X, MapPin, Filter } from "lucide-react";
import { IVideo } from "@/types";
import { CATEGORIES, KARNATAKA_DISTRICTS } from "@/constants";
import { cn, formatRelativeTime } from "@/lib/utils";
import { BottomNav } from "@/components/layout/BottomNav";


export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [district, setDistrict] = useState("");
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [showFilters, setShowFilters] = useState(false);


  const doSearch = useCallback(async () => {
    setLoading(true);
    setSearched(true);
    try {
      const params = new URLSearchParams();
      if (category) params.set("category", category);
      if (district) params.set("district", district);
      params.set("limit", "20");
      const res = await fetch(`/api/videos?${params}`);
      const data = await res.json();
      if (data.success) {
        let results = data.data.videos as IVideo[];
        if (query.trim()) {
          const q = query.toLowerCase();
          results = results.filter(
            (v) =>
              v.title.toLowerCase().includes(q) ||
              v.placeName.toLowerCase().includes(q) ||
              v.description.toLowerCase().includes(q) ||
              v.tags?.some((t) => t.toLowerCase().includes(q))
          );
        }
        setVideos(results);
      }
    } finally {
      setLoading(false);
    }
  }, [query, category, district]);


  useEffect(() => {
    if (category || district) doSearch();
  }, [category, district]);


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    doSearch();
  };


  const clearAll = () => {
    setQuery("");
    setCategory("");
    setDistrict("");
    setVideos([]);
    setSearched(false);
  };


  return (
    <div className="min-h-dvh bg-[#000000] pb-24">
      <div className="px-4 pt-14 pb-3 border-b border-[#1a1a1a]">
        <h1 className="text-xl font-bold text-white mb-3">Search</h1>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6e6e6e]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Places, stories, food..."
              className="w-full bg-[#111111] border border-[#2a2a2a] rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder-[#6e6e6e] focus:border-white transition-all"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-[#6e6e6e]" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center border transition-all",
              showFilters || category || district
                ? "bg-white border-white text-black"
                : "bg-[#111111] border-[#2a2a2a] text-[#6e6e6e]"
            )}
          >
            <Filter className="w-4 h-4" />
          </button>
        </form>


        {showFilters && (
          <div className="mt-3 space-y-2">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setCategory("")}
                className={cn("flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                  !category ? "bg-white text-black border-white" : "bg-[#111111] text-[#a1a1a1] border-[#2a2a2a]"
                )}
              >All</button>
              {CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setCategory(category === c.value ? "" : c.value)}
                  className={cn("flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                    category === c.value ? "bg-white text-black border-white" : "bg-[#111111] text-[#a1a1a1] border-[#2a2a2a]"
                  )}
                >
                  {c.emoji} {c.label}
                </button>
              ))}
            </div>


            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full bg-[#111111] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-sm text-white"
            >
              <option value="">All districts</option>
              {KARNATAKA_DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        )}


        {(category || district || query) && (
          <button onClick={clearAll} className="text-xs text-[#a1a1a1] mt-2">Clear all filters</button>
        )}
      </div>


      <div className="px-4 pt-4">
        {!searched && !loading && (
          <div className="py-10 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-sm font-medium text-white mb-1">Explore Karnataka</p>
            <p className="text-xs text-[#6e6e6e]">Search places, stories, food trails and hidden gems</p>
            <div className="grid grid-cols-2 gap-2 mt-6">
              {CATEGORIES.slice(0, 6).map((c) => (
                <button
                  key={c.value}
                  onClick={() => setCategory(c.value)}
                  className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-3 text-left"
                >
                  <span className="text-2xl">{c.emoji}</span>
                  <p className="text-xs font-medium text-white mt-1">{c.label}</p>
                </button>
              ))}
            </div>
          </div>
        )}


        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 skeleton rounded-xl" />
            ))}
          </div>
        )}


        {searched && !loading && videos.length === 0 && (
          <div className="py-16 text-center">
            <div className="text-4xl mb-3">😕</div>
            <p className="text-sm font-medium text-white">No results found</p>
            <p className="text-xs text-[#6e6e6e] mt-1">Try different keywords or filters</p>
          </div>
        )}


        {videos.length > 0 && (
          <>
            <p className="text-xs text-[#6e6e6e] mb-3">{videos.length} result{videos.length !== 1 ? "s" : ""}</p>
            <div className="space-y-3">
              {videos.map((video) => (
                <SearchResultCard key={video._id} video={video} />
              ))}
            </div>
          </>
        )}
      </div>


      <BottomNav />
    </div>
  );
}


function SearchResultCard({ video }: { video: IVideo }) {
  const cat = CATEGORIES.find((c) => c.value === video.category);
  const creator = typeof video.creatorId === "object" ? video.creatorId as { fullName: string } : null;


  return (
    <div className="bg-[#111111] rounded-2xl border border-[#2a2a2a] overflow-hidden flex">
      <div className="w-20 h-20 bg-[#1a1a1a] flex-shrink-0">
        {video.thumbnailUrl ? (
          <img src={video.thumbnailUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">
            {cat?.emoji || "🎬"}
          </div>
        )}
      </div>
      <div className="flex-1 p-3 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{video.title}</p>
        <div className="flex items-center gap-1 mt-1">
          <MapPin className="w-3 h-3 text-[#6e6e6e]" />
          <span className="text-[11px] text-[#6e6e6e] truncate">{video.placeName}, {video.district}</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[10px] text-[#6e6e6e]">
            by {creator?.fullName || "Creator"}
          </span>
          <span className="text-[10px] text-[#6e6e6e]">{formatRelativeTime(video.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}