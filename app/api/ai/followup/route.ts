import { NextRequest, NextResponse } from "next/server";
import { getGroq, SYSTEM_PROMPTS } from "@/lib/groq";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { role, messages } = await req.json();

  const completion = await getGroq().chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: SYSTEM_PROMPTS.intake },
      { role: "user", content: `El usuario es: ${role}. Historial: ${JSON.stringify(messages)}. Haz la siguiente pregunta de seguimiento.` },
    ],
    max_tokens: 150,
    temperature: 0.7,
  });

  return NextResponse.json({
    question: completion.choices[0].message.content,
  });
}
