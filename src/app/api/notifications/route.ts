import { NextResponse, NextRequest } from "next/server";

// Force Node.js runtime for parity with the prior implementation
export const runtime = "nodejs";

/**
 * Notifications API disabled temporarily. Returns 410 Gone for all requests.
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({ error: "Notifications API disabled" }, { status: 410 });
}

export async function PATCH(request: NextRequest) {
  return NextResponse.json({ error: "Notifications API disabled" }, { status: 410 });
}
