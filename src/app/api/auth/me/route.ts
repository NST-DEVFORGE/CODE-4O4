import { NextResponse } from "next/server";
import { verifyToken, type JWTPayload } from "@/lib/auth-utils";
import { cookies } from "next/headers";

// GET - Retrieve current user from JWT token (no localStorage needed)
export async function GET() {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("code404-auth-token");

    if (!authToken?.value) {
      return NextResponse.json({ user: null });
    }

    // Verify the JWT token
    const decoded = verifyToken<JWTPayload>(authToken.value);
    
    if (!decoded) {
      return NextResponse.json({ user: null });
    }

    // Return user data from the token
    // Note: This only returns data encoded in the JWT, not full profile data
    return NextResponse.json({
      user: {
        id: decoded.userId,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role,
      }
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}
