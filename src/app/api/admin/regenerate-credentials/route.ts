import { NextResponse, NextRequest } from "next/server";
import { getDb } from "@/lib/firebase/admin";
import { sendBulkCredentialsEmails } from "@/lib/email";
import { verifyAdminAuth, hashPassword, generateSecurePassword } from "@/lib/auth-utils";

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

    const { sendEmails = true } = await request.json();

    const db = getDb();
    const membersSnapshot = await db.collection("members").get();

    if (membersSnapshot.empty) {
      return NextResponse.json({
        ok: false,
        message: "No members found",
      });
    }

    const updatedMembers = [];
    const emailQueue = [];

    for (const memberDoc of membersSnapshot.docs) {
      const memberData = memberDoc.data();
      const memberId = memberDoc.id;

      // Generate username from name
      const firstName = memberData.name?.split(" ")[0]?.toLowerCase().replace(/[^a-z0-9]/g, "") || "";

      const finalUsername = firstName;

      // Generate secure random password
      const finalPassword = generateSecurePassword(12);

      // Hash the password before storing
      const hashedPassword = await hashPassword(finalPassword);

      // Update the member document with hashed password
      await memberDoc.ref.update({
        username: finalUsername,
        password: hashedPassword,
        credentialsUpdated: new Date().toISOString(),
      });

      updatedMembers.push({
        id: memberId,
        name: memberData.name,
        email: memberData.email,
        username: finalUsername,
        password: finalPassword, // Keep plaintext for email only
      });

      // Add to email queue
      if (sendEmails && memberData.email) {
        emailQueue.push({
          email: memberData.email,
          name: memberData.name,
          username: finalUsername,
          password: finalPassword,
        });
      }

      console.log(`✅ Updated credentials for ${memberData.name} (username: ${finalUsername})`);
    }

    // Send emails in bulk
    let emailResults: Array<{ email: string; name: string; success: boolean }> = [];
    if (sendEmails && emailQueue.length > 0) {
      console.log(`📧 Sending ${emailQueue.length} credential emails...`);
      emailResults = await sendBulkCredentialsEmails(emailQueue);
      console.log(`✅ Sent ${emailResults.filter(r => r.success).length}/${emailQueue.length} emails`);
    }

    return NextResponse.json({
      ok: true,
      message: `Successfully updated credentials for ${updatedMembers.length} members`,
      data: {
        totalUpdated: updatedMembers.length,
        emailsSent: emailResults.filter(r => r.success).length,
        emailsFailed: emailResults.filter(r => !r.success).length,
        members: updatedMembers.map(m => ({
          name: m.name,
          email: m.email,
          username: m.username,
          // Password not included in response for security
        })),
      },
    });
  } catch (error) {
    console.error("❌ Error regenerating credentials:", error);
    return NextResponse.json(
      {
        ok: false,
        message: "Failed to regenerate credentials",
        error: String(error),
      },
      { status: 500 },
    );
  }
}
