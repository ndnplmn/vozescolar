import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { response } = await req.json();
  const db = createServerClient();

  const { error } = await db
    .from("complaints")
    .update({ admin_response: response, status: "en_proceso" })
    .eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await db.from("timeline_entries").insert({
    complaint_id: params.id,
    status:       "en_proceso",
    message:      "Respuesta oficial enviada.",
  });

  return NextResponse.json({ ok: true });
}
