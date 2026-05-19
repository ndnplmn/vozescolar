import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { toComplaint, DBComplaint } from "@/lib/db";

export const dynamic = "force-dynamic";

// Handles both folio lookups (VE-XXXX-XXXX) and UUID lookups (admin)
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const db = createServerClient();
  const isFolio = /^VE-\d{4}-\d{4}$/.test(params.id);

  const { data, error } = isFolio
    ? await db.from("complaints").select("*, timeline_entries(*)").eq("folio", params.id).single()
    : await db.from("complaints").select("*, timeline_entries(*)").eq("id", params.id).single();

  if (error || !data) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  return NextResponse.json({ complaint: toComplaint(data as DBComplaint) });
}
