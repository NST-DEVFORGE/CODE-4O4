import { NextResponse, NextRequest } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  return NextResponse.json({ error: "Notifications sending disabled" }, { status: 410 });
}
