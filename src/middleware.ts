import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/jwt";
import { JWT_COOKIE_NAME } from "@/constants";

const PUBLIC_ROUTES = ["/login", "/signup"];
const CREATOR_ROUTES = ["/upload"];
const ADMIN_ROUTES = ["/admin"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(JWT_COOKIE_NAME)?.value;
  const user = token ? verifyToken(token) : null;

  // Redirect logged-in users away from auth pages
  if (PUBLIC_ROUTES.some((r) => pathname.startsWith(r))) {
    if (user) {
      const dest = user.role === "ADMIN" ? "/admin" : "/";
      return NextResponse.redirect(new URL(dest, request.url));
    }
    return NextResponse.next();
  }

  // Protect creator routes
  if (CREATOR_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!user) return NextResponse.redirect(new URL("/login", request.url));
    if (user.role !== "CREATOR") return NextResponse.redirect(new URL("/", request.url));
    return NextResponse.next();
  }

  // Protect admin routes
  if (ADMIN_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!user) return NextResponse.redirect(new URL("/login", request.url));
    if (user.role !== "ADMIN") return NextResponse.redirect(new URL("/", request.url));
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
