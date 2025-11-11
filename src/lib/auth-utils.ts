import { NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function verifyAdminAuth(request: NextRequest): Promise<{ 
  isAdmin: boolean; 
  user?: any;
  error?: string;
}> {
  try {
    // Check cookie
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("code404-user");
    
    if (!userCookie?.value) {
      return { isAdmin: false, error: "Not authenticated" };
    }

    const user = JSON.parse(userCookie.value);
    
    if (user.role !== "admin") {
      return { isAdmin: false, error: "Not authorized - admin access required" };
    }

    return { isAdmin: true, user };
  } catch (error) {
    console.error("Auth verification error:", error);
    return { isAdmin: false, error: "Authentication failed" };
  }
}
