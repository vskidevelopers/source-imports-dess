// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtected =
    path.startsWith("/admin") && !path.startsWith("/admin/login");

  if (isProtected) {
    // Supabase v2 sets cookies like: sb-<project-ref>-auth-token
    const cookie =
      request.cookies.get("supabase-auth-token")?.value ||
      [...request.cookies.getAll()].find((c) => c.name.includes("auth-token"))
        ?.value;

    if (!cookie) {
      console.log(
        "[Middleware] ❌ No auth token | Redirecting to /admin/login",
      );
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    console.log(
      "[Middleware] ✅ Auth token found | Proceeding to protected route",
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
