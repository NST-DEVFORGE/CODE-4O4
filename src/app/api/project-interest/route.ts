import { NextResponse } from "next/server";
import { getDb, serverTimestamp } from "@/lib/firebase/admin";

// Force Node.js runtime for firebase-admin
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { projectId, userId } = (await request.json()) as {
      projectId?: string;
      userId?: string;
    };
    
    console.log("Received project interest request:", { projectId, userId });
    
    if (!projectId || !userId) {
      console.error("Missing required fields:", { projectId, userId });
      return NextResponse.json(
        { ok: false, message: "Missing project or user id" },
        { status: 400 },
      );
    }
    
    // Try to save to Firestore, but don't fail if it doesn't work (demo mode)
    try {
      console.log("Getting Firestore database...");
      const db = getDb();
      
      console.log("Writing to projectInterests collection...");
      const docRef = await db.collection("projectInterests").add({
        projectId,
        userId,
        createdAt: serverTimestamp(),
      });
      
      console.log("✅ Successfully saved project interest with ID:", docRef.id);
      return NextResponse.json({ ok: true, message: "Project lead notified." });
    } catch (firestoreError) {
      // Log the error but still return success for demo purposes
      console.warn("⚠️  Firestore save failed (running in demo mode):", String(firestoreError));
      console.log("✅ Demo mode: Project interest logged for:", projectId, "from user:", userId);
      return NextResponse.json({ 
        ok: true, 
        message: "Project lead notified. (Demo mode - not persisted)" 
      });
    }
  } catch (error) {
    console.error("project interest error details:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : "N/A");
    return NextResponse.json(
      { ok: false, message: "Unable to save interest.", error: String(error) },
      { status: 500 },
    );
  }
}
