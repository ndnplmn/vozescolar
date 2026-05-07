import { NextRequest, NextResponse } from "next/server";
import { groq, SYSTEM_PROMPTS } from "@/lib/groq";

export async function POST(req: NextRequest) {
  const { content } = await req.json();

  const completion = await groq.chat.completions.create({
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
  return NextResponse.json({
    category: result.category ?? "otro",
    urgency: result.urgency ?? "medium",
  });
}
