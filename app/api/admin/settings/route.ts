import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { DEFAULT_SCHOOL_CONFIG } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = createServerClient();
  const { data } = await db.from("settings").select("data").eq("id", "singleton").single();
  return NextResponse.json(data?.data ?? DEFAULT_SCHOOL_CONFIG);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const db = createServerClient();

  const { error } = await db
    .from("settings")
    .upsert({ id: "singleton", data: body, updated_at: new Date().toISOString() });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
