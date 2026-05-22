import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { DEFAULT_SCHOOL_CONFIG } from "@/lib/config";

export const dynamic = "force-dynamic";

const MAX_NAME_LENGTH = 100;
const MAX_URL_LENGTH  = 500;

export async function GET() {
  const db = createServerClient();
  const { data } = await db.from("settings").select("data").eq("id", "singleton").single();
  return NextResponse.json(data?.data ?? DEFAULT_SCHOOL_CONFIG);
}

export async function PUT(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const { name, logoUrl, primaryColor } = body;

  if (name !== undefined) {
    if (typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "El nombre de la institución es requerido." }, { status: 400 });
    }
    if (name.length > MAX_NAME_LENGTH) {
      return NextResponse.json({ error: "El nombre excede el límite permitido." }, { status: 400 });
    }
  }

  if (logoUrl !== undefined && typeof logoUrl === "string" && logoUrl.length > MAX_URL_LENGTH) {
    return NextResponse.json({ error: "La URL del logo es demasiado larga." }, { status: 400 });
  }

  if (primaryColor !== undefined && !/^#[0-9a-fA-F]{6}$/.test(primaryColor)) {
    return NextResponse.json({ error: "Color primario inválido. Usa formato hexadecimal (#rrggbb)." }, { status: 400 });
  }

  const sanitized = {
    ...DEFAULT_SCHOOL_CONFIG,
    ...(name         ? { name: name.trim() }               : {}),
    ...(logoUrl      ? { logoUrl }                          : {}),
    ...(primaryColor ? { primaryColor }                     : {}),
  };

  const db = createServerClient();
  const { error } = await db
    .from("settings")
    .upsert({ id: "singleton", data: sanitized, updated_at: new Date().toISOString() });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
