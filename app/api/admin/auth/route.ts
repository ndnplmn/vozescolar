import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const COOKIE = "vz_admin";

export async function POST(req: NextRequest) {
  const { pin } = await req.json();

  if (!pin || pin !== process.env.ADMIN_PIN) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, process.env.ADMIN_SESSION_SECRET!, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    // Session cookie — expires when the browser closes
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 });
  return res;
}
