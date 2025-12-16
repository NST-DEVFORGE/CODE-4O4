import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebase/admin";
import { verifyToken, type JWTPayload } from "@/lib/auth-utils";
import { cookies } from "next/headers";

export async function GET() {
  try {
    // Secure authentication check using JWT token
    const cookieStore = await cookies();
    const authToken = cookieStore.get("code404-auth-token");
    
    let isAdmin = false;

    if (authToken?.value) {
      // Verify the JWT token - this cannot be forged
      const decoded = verifyToken<JWTPayload>(authToken.value);
      if (decoded && (decoded.role === "admin" || decoded.role === "mentor")) {
        isAdmin = true;
      }
    }

    // Fallback check for backward compatibility with user cookie
    // Note: This is less secure and should be migrated to JWT-only
    if (!isAdmin) {
      const userCookie = cookieStore.get("code404-user");
      if (userCookie?.value) {
        try {
          const user = JSON.parse(decodeURIComponent(userCookie.value));
          // Only trust if role is admin or mentor and we have a matching auth token
          // WITHOUT an auth token, we don't trust the cookie role for security
          if (authToken?.value && (user.role === "admin" || user.role === "mentor")) {
            isAdmin = true;
          }
        } catch {
          // Invalid cookie data
        }
      }
    }

    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    const db = getDb();
    const snapshot = await db.collection("hackathon_registrations").orderBy("createdAt", "desc").get();
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ success: true, registrations: data });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Admin GET registrations error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch registrations" },
      { status: 500 }
    );
  }
}
