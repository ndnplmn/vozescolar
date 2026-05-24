import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const COOKIE = "vz_admin";

// In-memory rate limiter: ip → { count, resetAt }
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS  = 5;
const WINDOW_MS     = 15 * 60 * 1000; // 15 minutes

function getClientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
}

export async function POST(req: NextRequest) {
  const ip  = getClientIp(req);
  const now = Date.now();

  const entry = loginAttempts.get(ip);
  if (entry && now < entry.resetAt) {
    if (entry.count >= MAX_ATTEMPTS) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      return NextResponse.json(
        { ok: false, error: "Demasiados intentos. Espera unos minutos antes de intentar de nuevo." },
        { status: 429, headers: { "Retry-After": String(retryAfter) } }
      );
    }
  } else {
    // Reset window
    loginAttempts.set(ip, { count: 0, resetAt: now + WINDOW_MS });
  }

  const { pin } = await req.json();

  if (!pin || pin !== process.env.ADMIN_PIN) {
    const current = loginAttempts.get(ip)!;
    loginAttempts.set(ip, { ...current, count: current.count + 1 });
    const remaining = MAX_ATTEMPTS - (current.count + 1);
    return NextResponse.json(
      { ok: false, error: remaining > 0 ? `PIN incorrecto. ${remaining} intento(s) restantes.` : "PIN incorrecto. Cuenta bloqueada por 15 minutos." },
      { status: 401 }
    );
  }

  // Successful login — clear the counter
  loginAttempts.delete(ip);

  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    return NextResponse.json({ ok: false, error: "Error de configuración del servidor." }, { status: 500 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    // Session cookie — expires when the browser closes
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, "", { httpOnly: true, sameSite: "strict", path: "/", maxAge: 0 });
  return res;
}
