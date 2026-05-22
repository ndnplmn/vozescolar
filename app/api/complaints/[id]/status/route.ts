import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const VALID_STATUSES = ["recibida", "en_revision", "en_proceso", "resuelta", "cerrada"] as const;
type ValidStatus = typeof VALID_STATUSES[number];

// Allowed forward transitions (no going backwards)
const TRANSITIONS: Record<ValidStatus, ValidStatus[]> = {
  recibida:    ["en_revision", "cerrada"],
  en_revision: ["en_proceso", "cerrada"],
  en_proceso:  ["resuelta", "cerrada"],
  resuelta:    ["cerrada"],
  cerrada:     [],
};

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });

  const { status, message } = body;

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
  }

  const db = createServerClient();

  // Check current status for transition validation
  const { data: current } = await db
    .from("complaints")
    .select("status")
    .eq("id", params.id)
    .single();

  if (!current) {
    return NextResponse.json({ error: "Reporte no encontrado" }, { status: 404 });
  }

  const currentStatus = current.status as ValidStatus;
  const allowed = TRANSITIONS[currentStatus] ?? [];

  if (currentStatus !== status && !allowed.includes(status as ValidStatus)) {
    return NextResponse.json(
      { error: `Transición inválida: ${currentStatus} → ${status}` },
      { status: 422 }
    );
  }

  const { error } = await db
    .from("complaints")
    .update({ status })
    .eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await db.from("timeline_entries").insert({
    complaint_id: params.id,
    status,
    message: message ?? null,
  });

  return NextResponse.json({ ok: true });
}
