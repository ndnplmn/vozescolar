import { NextRequest, NextResponse } from "next/server";
import { getGroq, SYSTEM_PROMPTS } from "@/lib/groq";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json();

    const completion = await getGroq().chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPTS.sentiment },
        { role: "user", content },
      ],
      max_tokens: 200,
      temperature: 0.1,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0].message.content || "{}";
    const result = JSON.parse(raw);
    return NextResponse.json({
      score:    result.score    ?? 50,
      emotions: result.emotions ?? [],
      summary:  result.summary  ?? "",
    });
  } catch (err) {
    console.error("[ai/sentiment] error:", err);
    return NextResponse.json({ score: 50, emotions: [], summary: "" }, { status: 200 });
  }
}
