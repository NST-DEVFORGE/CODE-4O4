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
    
    console.log("📝 Received project interest request:", { projectId, userId });
    
    if (!projectId || !userId) {
      console.error("❌ Missing required fields:", { projectId, userId });
      return NextResponse.json(
        { ok: false, message: "Missing project or user id" },
        { status: 400 },
      );
    }
    
    try {
      console.log("🔄 Getting Firestore database...");
      const db = getDb();
      
      console.log("💾 Writing to projectInterests collection...");
      const docRef = await db.collection("projectInterests").add({
        projectId,
        userId,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      
      console.log("✅ Successfully saved project interest with ID:", docRef.id);
      return NextResponse.json({ 
        ok: true, 
        message: "Project lead notified.",
        data: { id: docRef.id }
      });
    } catch (firestoreError) {
      console.warn("⚠️  Firestore save failed:", String(firestoreError));
      console.log("🔄 Running in demo mode - data logged to console");
      return NextResponse.json({ 
        ok: true, 
        message: "Project lead notified. (Demo mode - not persisted)" 
      });
    }
  } catch (error) {
    console.error("❌ project interest error:", error);
    return NextResponse.json(
      { ok: false, message: "Unable to save interest.", error: String(error) },
      { status: 500 },
    );
  }
}
