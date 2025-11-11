import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Protect admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Check if user is logged in and has admin role
    const userCookie = request.cookies.get("code404-user");
    
    if (!userCookie) {
      // No user cookie, redirect to home
      return NextResponse.redirect(new URL("/", request.url));
    }

    try {
      const user = JSON.parse(userCookie.value);
      
      if (user.role !== "admin") {
        // User is not admin, redirect to home
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch {
      // Invalid cookie, redirect to home
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
