import { NextResponse, NextRequest } from "next/server";
import { getDb, serverTimestamp } from "@/lib/firebase/admin";
import { verifyAdminAuth } from "@/lib/auth-utils";

// Force Node.js runtime for firebase-admin
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const auth = await verifyAdminAuth(request);
    if (!auth.isAdmin) {
      return NextResponse.json(
        { ok: false, message: auth.error || "Unauthorized" },
        { status: 401 },
      );
    }

    const { id, decision } = (await request.json()) as {
      id?: string;
      decision?: "approve" | "hold" | string;
    };

    if (!id || !decision) {
      return NextResponse.json(
        { ok: false, message: "Missing id or decision" },
        { status: 400 },
      );
    }

    const db = getDb();
    await db.collection("adminDecisions").add({
      requestId: id,
      decision,
      actedBy: auth.user?.name || "Admin",
      actedAt: serverTimestamp(),
    });

    return NextResponse.json({ ok: true, message: "Decision recorded." });
  } catch (error) {
    console.error("admin decision error", error);
    return NextResponse.json(
      { ok: false, message: "Unable to persist decision.", error: String(error) },
      { status: 500 },
    );
  }
}
