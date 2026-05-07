import { NextRequest } from "next/server";
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

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const groqStream = await getGroq().chat.completions.create({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: SYSTEM_PROMPTS.intakeQuestion },
            {
              role: "user",
              content: `El usuario es un ${roleLabel}.\n\nConversación:\n${history}`,
            },
          ],
          max_tokens: 150,
          temperature: 0.7,
          stream: true,
        });

        for await (const chunk of groqStream) {
          const delta = chunk.choices[0]?.delta?.content ?? "";
          if (delta) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: "delta", text: delta })}\n\n`)
            );
          }
        }

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
      } catch {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "fallback", text: "¿Hay algo más que quieras agregar, o está bien así para continuar?" })}\n\n`
          )
        );
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
