import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { AuthUser } from "@/types";
import { JWT_COOKIE_NAME } from "@/constants";
import { JWTPayload } from "jose";

const JWT_SECRET = process.env.JWT_SECRET!;

if (!JWT_SECRET) {
  throw new Error("Please define the JWT_SECRET environment variable");
}

const secret = new TextEncoder().encode(JWT_SECRET);
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export async function signToken(payload: AuthUser): Promise<string> {
  return await new SignJWT(payload as unknown as JWTPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(secret);
}

export async function verifyToken(
  token: string
): Promise<AuthUser | null> {
  try {
    const { payload } = await jwtVerify(token, secret);

    return {
      id: payload.id as string,
      fullName: payload.fullName as string,
      email: payload.email as string,
      role: payload.role as AuthUser["role"],
      profileImage: payload.profileImage as string | undefined,
      district: payload.district as string | undefined,
    };
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(JWT_COOKIE_NAME)?.value;

    if (!token) return null;

    return await verifyToken(token);
  } catch {
    return null;
  }
}

export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(JWT_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(JWT_COOKIE_NAME);
}