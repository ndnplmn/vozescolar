import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const TERMINAL_STATUSES = ["resuelta", "cerrada"];
const MAX_RESPONSE_LENGTH = 2000;

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });

  const { response } = body;

  if (!response || typeof response !== "string" || response.trim().length === 0) {
    return NextResponse.json({ error: "La respuesta no puede estar vacía." }, { status: 400 });
  }

  if (response.length > MAX_RESPONSE_LENGTH) {
    return NextResponse.json(
      { error: `La respuesta excede el límite de ${MAX_RESPONSE_LENGTH} caracteres.` },
      { status: 400 }
    );
  }

  const db = createServerClient();

  const { data: current } = await db
    .from("complaints")
    .select("status")
    .eq("id", params.id)
    .single();

  if (!current) {
    return NextResponse.json({ error: "Reporte no encontrado" }, { status: 404 });
  }

  const isTerminal = TERMINAL_STATUSES.includes(current.status ?? "");
  const newStatus = isTerminal ? current.status : "en_proceso";

  const { error } = await db
    .from("complaints")
    .update({ admin_response: response.trim(), status: newStatus })
    .eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (!isTerminal) {
    await db.from("timeline_entries").insert({
      complaint_id: params.id,
      status:       "en_proceso",
      message:      "Respuesta oficial enviada.",
    });
  }

  return NextResponse.json({ ok: true });
}
