"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Upload, X, CheckCircle, Loader2, CloudUpload,
  MapPin, Tag, ChevronDown, ArrowLeft
} from "lucide-react";
import { uploadVideo, generateVideoPath } from "@/lib/cloudinary/upload";
import { useAuth } from "@/features/auth/AuthContext";
import { CATEGORIES, KARNATAKA_DISTRICTS, ALLOWED_VIDEO_TYPES, MAX_VIDEO_SIZE } from "@/constants";
import { cn } from "@/lib/utils";
import { BottomNav } from "@/components/layout/BottomNav";

type Step = "pick" | "details" | "uploading" | "done";

export default function UploadPage() {
  const router = useRouter();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>("pick");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const [form, setForm] = useState({
    title: "", description: "", category: "",
    placeName: "", district: "", latitude: "", longitude: "",
    tags: "",
  });

  const handleFile = (f: File) => {
    setError("");
    if (!ALLOWED_VIDEO_TYPES.includes(f.type)) {
      setError("Only MP4, MOV, or WEBM files are allowed");
      return;
    }
    if (f.size > MAX_VIDEO_SIZE) {
      setError("Video must be under 200MB");
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setStep("details");
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !user) return;
    setError("");

    const required = ["title", "description", "category", "placeName", "district"];
    for (const k of required) {
      if (!form[k as keyof typeof form]?.trim()) {
        setError(`${k.charAt(0).toUpperCase() + k.slice(1)} is required`);
        return;
      }
    }

    setStep("uploading");
    try {
      const path = generateVideoPath(user.id, file.name);
      const { downloadURL, cloudinaryPath, publicId } = await uploadVideo(file, path, setProgress);

      const res = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
          videoUrl: downloadURL,
          cloudinaryPath: cloudinaryPath,  // ✅ Add this
          publicId: publicId,              // ✅ Add this
          latitude: form.latitude ? parseFloat(form.latitude) : undefined,
          longitude: form.longitude ? parseFloat(form.longitude) : undefined,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setStep("done");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      setError(msg);
      setStep("details");
    }
  };

  // ── STEP: Pick file ──
  if (step === "pick") {
    return (
      <div className="min-h-dvh bg-[#0d0d16] flex flex-col">
        <div className="flex items-center gap-3 px-4 pt-14 pb-4">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-[#1e1e2e] flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <h1 className="text-lg font-bold text-white">Upload story</h1>
        </div>

        {error && (
          <div className="mx-4 bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3 text-sm text-rose-400 mb-4">
            {error}
          </div>
        )}

        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-24">
          {/* Drop zone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "w-full aspect-[9/16] max-h-[55dvh] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-4 transition-all cursor-pointer",
              dragOver ? "border-[#7c3aed] bg-[#7c3aed]/10" : "border-[#2a2a3e] bg-[#161622] hover:border-[#7c3aed]/50"
            )}
          >
            <div className="w-16 h-16 rounded-2xl bg-[#7c3aed]/15 flex items-center justify-center">
              <CloudUpload className="w-8 h-8 text-[#a78bfa]" />
            </div>
            <div className="text-center">
              <p className="text-white font-semibold">Tap to upload video</p>
              <p className="text-sm text-[#555577] mt-1">MP4, MOV, WEBM · max 200MB</p>
              <p className="text-xs text-[#555577] mt-0.5">Vertical videos work best</p>
            </div>
            <div className="bg-[#7c3aed] rounded-full px-5 py-2">
              <span className="text-sm font-semibold text-white">Choose file</span>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/quicktime,video/webm"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
        </div>
        <BottomNav />
      </div>
    );
  }

  // ── STEP: Done ──
  if (step === "done") {
    return (
      <div className="min-h-dvh bg-[#0d0d16] flex flex-col items-center justify-center px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-500/15 flex items-center justify-center mb-5">
          <CheckCircle className="w-10 h-10 text-emerald-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Uploaded!</h2>
        <p className="text-sm text-[#9ca3af] mb-2">Your story is under admin review.</p>
        <p className="text-xs text-[#555577] mb-8">It will appear in the feed once approved.</p>
        <button
          onClick={() => router.push("/profile")}
          className="bg-[#7c3aed] text-white font-semibold px-8 py-3 rounded-xl mr-3"
        >
          View my videos
        </button>
        <button
          onClick={() => { setStep("pick"); setFile(null); setPreview(null); setProgress(0); setForm({ title:"",description:"",category:"",placeName:"",district:"",latitude:"",longitude:"",tags:"" }); }}
          className="text-[#a78bfa] font-medium mt-4 block"
        >
          Upload another
        </button>
      </div>
    );
  }

  // ── STEP: Uploading ──
  if (step === "uploading") {
    return (
      <div className="min-h-dvh bg-[#0d0d16] flex flex-col items-center justify-center px-8 text-center">
        <div className="w-20 h-20 rounded-full bg-[#7c3aed]/15 flex items-center justify-center mb-5">
          <Upload className="w-10 h-10 text-[#a78bfa]" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Uploading...</h2>
        <p className="text-sm text-[#9ca3af] mb-6">{progress}% complete</p>
        <div className="w-full bg-[#1e1e2e] rounded-full h-2 mb-2">
          <div
            className="bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-[#555577] mt-4">Don&apos;t close this tab</p>
      </div>
    );
  }

  // ── STEP: Details form ──
  return (
    <div className="min-h-dvh bg-[#0d0d16] flex flex-col overflow-y-auto">
      <div className="flex items-center gap-3 px-4 pt-14 pb-3 border-b border-[#1e1e2e]">
        <button onClick={() => { setStep("pick"); setFile(null); setPreview(null); }} className="w-9 h-9 rounded-full bg-[#1e1e2e] flex items-center justify-center">
          <ArrowLeft className="w-4 h-4 text-white" />
        </button>
        <h1 className="text-lg font-bold text-white flex-1">Story details</h1>
      </div>

      <div className="flex gap-3 items-start px-4 py-4 border-b border-[#1e1e2e]">
        {preview && (
          <div className="relative w-16 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-[#1e1e2e]">
            <video src={preview} className="w-full h-full object-cover" muted />
            <button
              onClick={() => { setStep("pick"); setFile(null); setPreview(null); }}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{file?.name}</p>
          <p className="text-xs text-[#555577] mt-1">{file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : ""}</p>
        </div>
      </div>

      {error && (
        <div className="mx-4 mt-3 bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3 text-sm text-rose-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="px-4 py-4 space-y-4 pb-28">
        <FormField label="Title *">
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Hidden waterfall in Coorg"
            maxLength={100}
            className={inputCls}
          />
        </FormField>

        <FormField label="Description *">
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Tell the story behind this place..."
            rows={3}
            maxLength={500}
            className={inputCls + " resize-none"}
          />
        </FormField>

        <FormField label="Category *">
          <div className="relative">
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className={inputCls + " appearance-none pr-10"}
            >
              <option value="">Select category</option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555577] pointer-events-none" />
          </div>
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Place name *">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555577]" />
              <input
                value={form.placeName}
                onChange={(e) => setForm({ ...form, placeName: e.target.value })}
                placeholder="Jog Falls"
                className={inputCls + " pl-9"}
              />
            </div>
          </FormField>

          <FormField label="District *">
            <div className="relative">
              <select
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
                className={inputCls + " appearance-none pr-8"}
              >
                <option value="">Select</option>
                {KARNATAKA_DISTRICTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#555577] pointer-events-none" />
            </div>
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Latitude (optional)">
            <input
              type="number"
              step="any"
              value={form.latitude}
              onChange={(e) => setForm({ ...form, latitude: e.target.value })}
              placeholder="12.9716"
              className={inputCls}
            />
          </FormField>
          <FormField label="Longitude (optional)">
            <input
              type="number"
              step="any"
              value={form.longitude}
              onChange={(e) => setForm({ ...form, longitude: e.target.value })}
              placeholder="77.5946"
              className={inputCls}
            />
          </FormField>
        </div>

        <FormField label="Tags (comma separated)">
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555577]" />
            <input
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="monsoon, waterfall, hidden gem"
              className={inputCls + " pl-9"}
            />
          </div>
        </FormField>

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex gap-2">
          <Loader2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-300">
            Your video will be reviewed by our admin team before appearing in the feed. This usually takes 24–48 hours.
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] active:scale-[0.98] text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <Upload className="w-5 h-5" />
          Submit for review
        </button>
      </form>

      <BottomNav />
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium text-[#9ca3af] mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full bg-[#161622] border border-[#2a2a3e] rounded-xl px-4 py-3 text-sm text-white placeholder-[#555577] focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] transition-all";
