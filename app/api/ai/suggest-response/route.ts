import { NextRequest, NextResponse } from "next/server";
import { getGroq, SYSTEM_PROMPTS } from "@/lib/groq";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { content, category, urgency } = await req.json();

    const completion = await getGroq().chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPTS.suggestResponse },
        { role: "user", content: `Categoría: ${category}. Urgencia: ${urgency}. Queja: "${content}"` },
      ],
      max_tokens: 300,
      temperature: 0.5,
    });

    return NextResponse.json({
      response: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error("[ai/suggest-response] error:", err);
    return NextResponse.json(
      { error: "ai_unavailable", response: null },
      { status: 503 }
    );
  }
}
