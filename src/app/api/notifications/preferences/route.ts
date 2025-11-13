import { NextResponse, NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  return NextResponse.json({ error: "Notifications disabled" }, { status: 410 });
}

export async function PATCH(request: NextRequest) {
  return NextResponse.json({ error: "Notifications disabled" }, { status: 410 });
}
