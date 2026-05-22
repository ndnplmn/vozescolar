import { NextRequest, NextResponse } from "next/server";
import { getGroq, SYSTEM_PROMPTS } from "@/lib/groq";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json();

    const completion = await getGroq().chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPTS.intakeSummary },
        { role: "user", content },
      ],
      max_tokens: 100,
      temperature: 0.3,
    });

    return NextResponse.json({
      summary: completion.choices[0].message.content?.trim() ?? "",
    });
  } catch (err) {
    console.error("[ai/summary] error:", err);
    return NextResponse.json({ error: "ai_unavailable", summary: null }, { status: 503 });
  }
}
