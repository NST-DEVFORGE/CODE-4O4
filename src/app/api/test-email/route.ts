import { NextResponse } from "next/server";
import { sendCredentialsEmail } from "@/lib/email";

export async function GET() {
  try {
    console.log("🧪 Testing email send...");
    console.log("SMTP Config:", {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      hasPassword: !!process.env.SMTP_PASS,
    });

    const result = await sendCredentialsEmail({
      to: "goyalgeetansh@gmail.com",
      name: "Geetansh Goyal",
      username: "geetansh",
      password: "test@123",
    });

    if (result.success) {
      return NextResponse.json({
        ok: true,
        message: "✅ Test email sent successfully!",
        messageId: result.messageId,
      });
    } else {
      return NextResponse.json({
        ok: false,
        message: "❌ Failed to send test email",
        error: result.error,
      });
    }
  } catch (error) {
    console.error("❌ Test email error:", error);
    return NextResponse.json({
      ok: false,
      message: "Error sending test email",
      error: String(error),
    });
  }
}
