import { NextRequest, NextResponse } from "next/server";
import { getGroq, SYSTEM_PROMPTS } from "@/lib/groq";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { complaints } = await req.json();

  const summary = complaints
    .map((c: { category: string; urgency: string; content: string }) =>
      `[${c.category}/${c.urgency}]: ${c.content.slice(0, 80)}`
    )
    .join("\n");

  const completion = await getGroq().chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: SYSTEM_PROMPTS.monthlySummary },
      { role: "user", content: `Total: ${complaints.length} quejas este mes.\n${summary}` },
    ],
    max_tokens: 250,
    temperature: 0.6,
  });

  return NextResponse.json({
    narrative: completion.choices[0].message.content,
  });
}
