import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { data: row } = await supabase
    .from("complaints")
    .select("evidence_url, evidence_name")
    .eq("id", params.id)
    .single();

  if (!row?.evidence_url) {
    return NextResponse.json({ error: "No evidence found" }, { status: 404 });
  }

  const { data: signed } = await supabase.storage
    .from("evidence")
    .createSignedUrl(row.evidence_url, 3600);

  if (!signed?.signedUrl) {
    return NextResponse.json({ error: "Could not generate URL" }, { status: 500 });
  }

  return NextResponse.json({
    signedUrl:    signed.signedUrl,
    evidenceName: row.evidence_name,
  });
}
