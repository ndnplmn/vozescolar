import { NextRequest, NextResponse } from "next/server";

const COOKIE = "vz_admin";

// Protects all /admin/* pages and /api/admin/* routes (except auth itself)
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow the auth endpoint through — it's how the cookie gets set
  if (pathname === "/api/admin/auth") return NextResponse.next();

  const cookie = req.cookies.get(COOKIE)?.value;
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret || cookie !== secret) {
    // API routes: return 401 JSON instead of redirecting
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    // Page routes: redirect to /admin (where AdminAuthGuard shows the PIN form)
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path+", "/api/admin/:path+"],
};
