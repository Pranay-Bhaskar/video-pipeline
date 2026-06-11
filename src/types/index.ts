export type Role = "EXPLORER" | "CREATOR" | "ADMIN";
export type VideoStatus = "PENDING" | "APPROVED" | "REJECTED";
export type Category =
  | "NATURE"
  | "HERITAGE"
  | "FOOD"
  | "TREKKING"
  | "WATERFALL"
  | "CULTURE"
  | "HIDDEN_GEM"
  | "TEMPLE"
  | "BEACH"
  | "WILDLIFE";

export interface IUser {
  _id: string;
  fullName: string;
  email: string;
  role: Role;
  profileImage?: string;
  bio?: string;
  district?: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IVideo {
  _id: string;
  title: string;
  description: string;
  category: Category;
  tags: string[];
  placeName: string;
  district: string;
  latitude?: number;
  longitude?: number;
  videoUrl: string;
  thumbnailUrl?: string;
  firebasePath: string;
  creatorId: IUser | string;
  status: VideoStatus;
  rejectionReason?: string;
  views: number;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  savesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  profileImage?: string;
  district?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
