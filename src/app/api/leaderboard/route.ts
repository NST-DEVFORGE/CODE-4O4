import { NextResponse, NextRequest } from "next/server";
import { getDb } from "@/lib/firebase/admin";

// Force Node.js runtime for firebase-admin
export const runtime = "nodejs";

/**
 * Update member stats for leaderboard
 * This endpoint can be called to award points, badges, or update project counts
 */
export async function POST(request: NextRequest) {
  try {
    const { userId, action, value } = await request.json();

    if (!userId || !action) {
      return NextResponse.json({
        ok: false,
        message: "User ID and action are required",
      });
    }

    console.log(`🏆 Updating stats for user ${userId}: ${action}`, value);

    const db = getDb();
    const userRef = db.collection("members").doc(userId);

    // Check if user exists
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return NextResponse.json({
        ok: false,
        message: "User not found",
      }, { status: 404 });
    }

    const currentData = userDoc.data();
    const updates: any = {
      updatedAt: new Date(),
    };

    // Handle different actions
    switch (action) {
      case "addPoints":
        updates.points = (currentData?.points || 0) + (value || 0);
        console.log(`✅ Adding ${value} points. New total: ${updates.points}`);
        break;

      case "addBadge":
        updates.badges = (currentData?.badges || 0) + 1;
        console.log(`✅ Adding badge. New total: ${updates.badges}`);
        break;

      case "completeProject":
        updates.projectsCompleted = (currentData?.projectsCompleted || 0) + 1;
        updates.points = (currentData?.points || 0) + 50; // Award 50 points for completing a project
        console.log(`✅ Project completed. New total: ${updates.projectsCompleted}`);
        break;

      case "joinProject":
        updates.points = (currentData?.points || 0) + 10; // Award 10 points for joining a project
        console.log(`✅ Joined project. Points awarded: 10`);
        break;

      case "attendEvent":
        updates.points = (currentData?.points || 0) + 25; // Award 25 points for attending an event
        console.log(`✅ Attended event. Points awarded: 25`);
        break;

      case "setPoints":
        updates.points = value || 0;
        console.log(`✅ Setting points to: ${updates.points}`);
        break;

      case "setBadges":
        updates.badges = value || 0;
        console.log(`✅ Setting badges to: ${updates.badges}`);
        break;

      default:
        return NextResponse.json({
          ok: false,
          message: `Unknown action: ${action}`,
        }, { status: 400 });
    }

    // Update the user document
    await userRef.update(updates);

    console.log(`✅ Stats updated successfully for user: ${userId}`);

    return NextResponse.json({
      ok: true,
      message: "Stats updated successfully",
      data: updates,
    });
  } catch (error) {
    console.error("❌ Error updating stats:", error);
    return NextResponse.json(
      {
        ok: false,
        message: "Failed to update stats",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * Get leaderboard stats for all users or specific user
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const limit = parseInt(searchParams.get("limit") || "100");

    const db = getDb();

    if (userId) {
      // Get stats for specific user
      const userDoc = await db.collection("members").doc(userId).get();
      if (!userDoc.exists) {
        return NextResponse.json({
          ok: false,
          message: "User not found",
        }, { status: 404 });
      }

      return NextResponse.json({
        ok: true,
        data: {
          id: userDoc.id,
          ...userDoc.data(),
        },
      });
    }

    // Get leaderboard (top users by points)
    const usersSnapshot = await db
      .collection("members")
      .orderBy("points", "desc")
      .limit(limit)
      .get();

    const leaderboard = usersSnapshot.docs.map((doc, index) => ({
      rank: index + 1,
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({
      ok: true,
      data: leaderboard,
    });
  } catch (error) {
    console.error("❌ Error fetching leaderboard:", error);
    return NextResponse.json(
      {
        ok: false,
        message: "Failed to fetch leaderboard",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
