import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const TERMINAL_STATUSES = ["resuelta", "cerrada"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { response } = await req.json();
  const db = createServerClient();

  // Read current status before deciding whether to advance it
  const { data: current } = await db
    .from("complaints")
    .select("status")
    .eq("id", params.id)
    .single();

  const isTerminal = TERMINAL_STATUSES.includes(current?.status ?? "");
  const newStatus = isTerminal ? current!.status : "en_proceso";

  const { error } = await db
    .from("complaints")
    .update({ admin_response: response, status: newStatus })
    .eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Only add timeline entry if status actually moved
  if (!isTerminal) {
    await db.from("timeline_entries").insert({
      complaint_id: params.id,
      status:       "en_proceso",
      message:      "Respuesta oficial enviada.",
    });
  }

  return NextResponse.json({ ok: true });
}
