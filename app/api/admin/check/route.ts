import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Middleware handles cookie validation and returns 401 for invalid/missing cookies.
// This endpoint just confirms the request made it through.
export async function GET() {
  return NextResponse.json({ ok: true });
}
