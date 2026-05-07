import { NextRequest, NextResponse } from "next/server";
import { getGroq, SYSTEM_PROMPTS } from "@/lib/groq";

export const dynamic = "force-dynamic";

const ROLE_CONTEXT: Record<string, string> = {
  alumno: "estudiante",
  padre: "padre o madre de familia",
  docente: "docente o maestro/a",
  personal: "personal administrativo o de apoyo",
};

export async function POST(req: NextRequest) {
  const { role, messages } = await req.json();

  const roleLabel = ROLE_CONTEXT[role] ?? role;
  const history = messages
    .map((m: { role: string; content: string }) =>
      `${m.role === "assistant" ? "Asistente" : "Usuario"}: ${m.content}`
    )
    .join("\n");

  const completion = await getGroq().chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: SYSTEM_PROMPTS.intake },
      {
        role: "user",
        content: `El usuario es un ${roleLabel}.\n\nConversación hasta ahora:\n${history}\n\nResponde con JSON: {"question": "siguiente pregunta empática", "ready": true/false}`,
      },
    ],
    max_tokens: 200,
    temperature: 0.6,
    response_format: { type: "json_object" },
  });

  const raw = completion.choices[0].message.content ?? "{}";
  const result = JSON.parse(raw);

  return NextResponse.json({
    question: result.question ?? "¿Puedes contarme un poco más sobre lo que pasó?",
    ready: result.ready === true,
  });
}
