import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebase/admin";
import { sendCredentialsEmail } from "@/lib/email";

// Update member credentials
export async function PATCH(request: Request) {
  try {
    const { memberId, username, password, sendEmail = true } = await request.json();

    if (!memberId) {
      return NextResponse.json(
        { ok: false, message: "Member ID is required" },
        { status: 400 },
      );
    }

    const db = getDb();
    const memberRef = db.collection("members").doc(memberId);
    const memberDoc = await memberRef.get();

    if (!memberDoc.exists) {
      return NextResponse.json(
        { ok: false, message: "Member not found" },
        { status: 404 },
      );
    }

    const memberData = memberDoc.data();
    
    // Generate username from name if not provided
    let finalUsername = username;
    if (!finalUsername && memberData?.name) {
      // Convert "Sahitya Singh" -> "sahitya"
      finalUsername = memberData.name.split(" ")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
    }

    // Generate unique password from name if not provided
    let finalPassword = password;
    if (!finalPassword && memberData?.name) {
      const firstName = memberData.name.split(" ")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
      const lastName = memberData.name.split(" ")[1]?.toLowerCase().replace(/[^a-z0-9]/g, "") || "";
      
      // Create more unique passwords with different patterns
      const patterns = [
        `${firstName}@123`,
        `${firstName}!123`,
        `${firstName}#123`,
        `${firstName}@${lastName}`,
        `${firstName}!${lastName}`,
        `${firstName}_${Math.floor(Math.random() * 1000)}`,
      ];
      
      // Use the member ID to consistently pick a pattern
      const patternIndex = memberId.charCodeAt(0) % patterns.length;
      finalPassword = patterns[patternIndex] || `${firstName}@123`;
    }

    // Update the member document
    await memberRef.update({
      username: finalUsername,
      password: finalPassword,
      credentialsUpdated: new Date().toISOString(),
    });

    console.log(`✅ Updated credentials for ${memberData?.name}: ${finalUsername} / ${finalPassword}`);

    // Send email with credentials if requested
    let emailSent = false;
    if (sendEmail && memberData?.email) {
      try {
        const emailResult = await sendCredentialsEmail({
          to: memberData.email,
          name: memberData.name,
          username: finalUsername,
          password: finalPassword,
        });
        emailSent = emailResult.success;
        console.log(`📧 Email sent to ${memberData.email}: ${emailSent ? 'Success' : 'Failed'}`);
      } catch (emailError) {
        console.error("❌ Error sending email:", emailError);
      }
    }

    return NextResponse.json({
      ok: true,
      message: emailSent 
        ? "Credentials updated and email sent successfully" 
        : "Credentials updated successfully",
      credentials: {
        username: finalUsername,
        password: finalPassword,
      },
      emailSent,
    });
  } catch (error) {
    console.error("❌ Error updating credentials:", error);
    return NextResponse.json(
      {
        ok: false,
        message: "Failed to update credentials",
        error: String(error),
      },
      { status: 500 },
    );
  }
}
