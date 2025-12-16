import { NextResponse, NextRequest } from "next/server";
import { getDb } from "@/lib/firebase/admin";
import { comparePassword, generateUserToken } from "@/lib/auth-utils";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  
  const rateLimitResponse = checkRateLimit(request, RATE_LIMITS.AUTH);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { ok: false, message: "Username and password are required" },
        { status: 400 },
      );
    }

    // Login attempt - no logging of sensitive data

    const db = getDb();

    
    const normalizedUsername = username.trim().toLowerCase();

    const membersSnapshot = await db
      .collection("members")
      .where("username", "==", normalizedUsername)
      .limit(1)
      .get();

    if (membersSnapshot.empty) {
      // No logging of username to prevent enumeration
      return NextResponse.json(
        { ok: false, message: "Invalid credentials." },
        { status: 401 },
      );
    }

    const memberDoc = membersSnapshot.docs[0];
    const memberData = memberDoc.data();

    
    const isPasswordValid = await comparePassword(password, memberData.password || '');

    if (!isPasswordValid) {
      // No logging of username to prevent enumeration
      return NextResponse.json(
        { ok: false, message: "Invalid credentials." },
        { status: 401 },
      );
    }

    
    const userProfile = {
      id: memberDoc.id,
      name: memberData.name,
      email: memberData.email,
      avatar: memberData.avatar,
      role: memberData.role || "student",
      badges: memberData.badges || 0,
      points: memberData.points || 0,
      github: memberData.github,
      portfolio: memberData.portfolio,
    };

    // Generate secure JWT token for server-side auth verification
    const authToken = generateUserToken({
      userId: memberDoc.id,
      email: memberData.email,
      role: memberData.role || "student",
      name: memberData.name,
    });

    // Successful login - no sensitive data logged

    const response = NextResponse.json({
      ok: true,
      message: `Welcome back, ${memberData.name.split(" ")[0]}!`,
      user: userProfile,
    });

    // Set HttpOnly secure cookie with JWT token
    // This cannot be accessed or modified by client-side JavaScript
    const isProduction = process.env.NODE_ENV === 'production';
    response.cookies.set('code404-auth-token', authToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        ok: false,
        message: "Login failed",
        error: "An error occurred",
      },
      { status: 500 },
    );
  }
}
