import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { generateFolio, hashContent } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { role, content, category, urgency, isAnonymous, evidenceBase64, evidenceName } = body;

    if (!content || typeof content !== "string" || content.trim().length < 20) {
      return NextResponse.json({ error: "El contenido del reporte es muy corto." }, { status: 400 });
    }
    if (content.length > 5000) {
      return NextResponse.json({ error: "El contenido excede el límite permitido." }, { status: 400 });
    }

    const id    = crypto.randomUUID();
    const folio = generateFolio();
    const hash  = await hashContent(content);
    const db    = createServerClient();

    let evidenceUrl: string | null = null;

    // Upload evidence to Supabase Storage if provided
    if (evidenceBase64 && evidenceName) {
      const base64Data = evidenceBase64.split(",")[1];
      const buffer     = Buffer.from(base64Data, "base64");
      const ext        = evidenceName.split(".").pop();
      const path       = `${id}.${ext}`;

      const { error: uploadError } = await db.storage
        .from("evidence")
        .upload(path, buffer, {
          contentType: evidenceName.endsWith(".pdf") ? "application/pdf" : "image/jpeg",
          upsert: false,
        });

      if (!uploadError) evidenceUrl = path;
    }

    // Insert complaint
    const { error: insertError } = await db.from("complaints").insert({
      id,
      folio,
      role,
      content,
      category,
      urgency,
      status:        "recibida",
      is_anonymous:  isAnonymous ?? true,
      content_hash:  hash,
      evidence_url:  evidenceUrl,
      evidence_name: evidenceName ?? null,
    });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // Insert initial timeline entry
    await db.from("timeline_entries").insert({
      complaint_id: id,
      status:       "recibida",
    });

    return NextResponse.json({ folio });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
