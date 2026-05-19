import { NextRequest, NextResponse } from "next/server";
import { getGroq, SYSTEM_PROMPTS } from "@/lib/groq";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { content } = await req.json();

  try {
    const completion = await getGroq().chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPTS.classify },
        { role: "user", content: `Clasifica esta queja escolar: "${content}"` },
      ],
      max_tokens: 100,
      temperature: 0.1,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(completion.choices[0].message.content || "{}");

    const VALID_CATEGORIES = ["acoso_escolar", "docente", "infraestructura", "administrativo", "seguridad", "otro"];
    const VALID_URGENCIES  = ["critical", "high", "medium", "low"];

    const category = VALID_CATEGORIES.includes(result.category) ? result.category : "otro";
    const urgency  = VALID_URGENCIES.includes(result.urgency)  ? result.urgency  : "medium";

    return NextResponse.json({ category, urgency });
  } catch (err) {
    console.error("[ai/classify] Groq error:", err);
    return NextResponse.json({ error: "ai_unavailable", category: null, urgency: null }, { status: 503 });
  }
}
