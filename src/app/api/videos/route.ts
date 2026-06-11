import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Video } from "@/models/Video";
import { getAuthUser } from "@/lib/auth/jwt";
import { apiError, apiSuccess } from "@/lib/utils";
import { FEED_PAGE_SIZE } from "@/constants";

// GET /api/videos — public feed (approved only)
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || String(FEED_PAGE_SIZE));
    const category = searchParams.get("category");
    const district = searchParams.get("district");
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = { status: "APPROVED" };
    if (category) query.category = category;
    if (district) query.district = district;

    const [videos, total] = await Promise.all([
      Video.find(query)
        .populate("creatorId", "fullName profileImage district isVerified")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Video.countDocuments(query),
    ]);

    return apiSuccess({
      videos,
      total,
      page,
      limit,
      hasMore: skip + videos.length < total,
    });
  } catch (err) {
    console.error("Feed error:", err);
    return apiError("Failed to load feed", 500);
  }
}

// POST /api/videos — save video metadata after Firebase upload
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthUser();
    if (!user) return apiError("Not authenticated", 401);
    if (user.role !== "CREATOR") return apiError("Only creators can upload videos", 403);

    const body = await req.json();
    const { title, description, category, placeName, district, latitude, longitude, tags, videoUrl, firebasePath } = body;

    if (!title || !description || !category || !placeName || !district || !videoUrl || !firebasePath) {
      return apiError("Missing required fields", 400);
    }

    const video = await Video.create({
      title: title.trim(),
      description: description.trim(),
      category,
      placeName: placeName.trim(),
      district,
      latitude: latitude ? parseFloat(latitude) : undefined,
      longitude: longitude ? parseFloat(longitude) : undefined,
      tags: tags || [],
      videoUrl,
      firebasePath,
      creatorId: user.id,
      status: "PENDING",
    });

    return apiSuccess({ video }, "Video uploaded successfully. Pending admin review.", 201);
  } catch (err) {
    console.error("Upload error:", err);
    return apiError("Failed to save video", 500);
  }
}
