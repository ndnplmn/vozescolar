"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Role } from "@/lib/types";
import { Send, ArrowRight, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";

interface Message { role: "assistant" | "user"; content: string; }

const ROLE_OPENERS: Record<Role, string> = {
  alumno:   "Hola. Este es un espacio completamente seguro y confidencial. Nadie sabrá quién eres. Cuéntame con tus propias palabras qué situación quieres reportar.",
  padre:    "Hola. Puedes hablar con total confianza — tu identidad está protegida en todo momento. ¿Qué situación relacionada con tu hijo o hija quieres reportar?",
  docente:  "Hola. Este canal es confidencial y seguro para toda la comunidad del CETIS 52. ¿Qué situación quieres poner en conocimiento de la dirección?",
  personal: "Hola. Este espacio es seguro y tu identidad está protegida. ¿Qué situación quieres reportar?",
};

const CRISIS_KEYWORDS = [
  "suicid", "matarme", "quitarme la vida", "hacerme daño", "ya no quiero vivir",
  "autolesion", "cortarme", "no quiero seguir", "quiero morirme", "me quiero morir",
];

function hasCrisis(text: string) {
  const lower = text.toLowerCase();
  return CRISIS_KEYWORDS.some((k) => lower.includes(k));
}

function BlinkingCursor() {
  return (
    <motion.span
      className="inline-block w-0.5 h-3.5 bg-gray-400 ml-0.5 align-text-bottom"
      animate={{ opacity: [1, 0] }}
      transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
    />
  );
}

export function Step2Chat({
  userRole,
  onComplete,
}: {
  userRole: Role;
  onComplete: (content: string) => void;
}) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: ROLE_OPENERS[userRole] },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [ready, setReady] = useState(false);
  const [crisis, setCrisis] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  // Summary state
  const [summary, setSummary] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryFetched, setSummaryFetched] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  const userMessages = messages.filter((m) => m.role === "user");
  const totalWords = userMessages.reduce(
    (acc, m) => acc + m.content.split(/\s+/).filter(Boolean).length,
    0
  );

  useEffect(() => { setWordCount(totalWords); }, [totalWords]);

  const canContinue = ready || wordCount >= 15;

  // Fetch summary once canContinue becomes true
  useEffect(() => {
    if (!canContinue || summaryFetched || userMessages.length === 0) return;
    setSummaryFetched(true);
    setSummaryLoading(true);

    const allUserText = userMessages.map((m) => m.content).join(" ");
    fetch("/api/ai/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: allUserText }),
    })
      .then((r) => r.json())
      .then((data) => setSummary(data.summary ?? ""))
      .catch(() => setSummary(""))
      .finally(() => setSummaryLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canContinue]);

  const handleContinue = useCallback(() => {
    const allUserText = userMessages.map((m) => m.content).join(" ");
    onComplete(allUserText);
  }, [userMessages, onComplete]);

  async function sendMessage() {
    if (!input.trim() || streaming) return;
    const text = input.trim();
    const userMsg: Message = { role: "user", content: text };
    const newMessages = [...messages, userMsg];

    setMessages([...newMessages, { role: "assistant", content: "" }]);
    setInput("");

    if (hasCrisis(text)) setCrisis(true);

    setStreaming(true);

    try {
      const res = await fetch("/api/ai/followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: userRole, messages: newMessages }),
      });

      if (!res.body) throw new Error("No stream body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";

        for (const part of parts) {
          if (!part.startsWith("data: ")) continue;
          const raw = part.slice(6);
          if (raw === "[DONE]") continue;

          try {
            const event = JSON.parse(raw);

            if (event.type === "delta") {
              fullText += event.text;
              const displayText = fullText.replace(/\[READY\]\s*$/m, "").trimEnd();
              setMessages((prev) => {
                const msgs = [...prev];
                msgs[msgs.length - 1] = { role: "assistant", content: displayText };
                return msgs;
              });
            } else if (event.type === "fallback") {
              fullText = event.text;
              setMessages((prev) => {
                const msgs = [...prev];
                msgs[msgs.length - 1] = { role: "assistant", content: fullText };
                return msgs;
              });
              setReady(true);
            }
          } catch {
            // ignore parse errors on partial chunks
          }
        }
      }

      // Final pass: strip [READY] marker and detect it
      const cleanText = fullText.replace(/\[READY\]\s*$/m, "").trimEnd();
      setMessages((prev) => {
        const msgs = [...prev];
        msgs[msgs.length - 1] = { role: "assistant", content: cleanText };
        return msgs;
      });

      if (fullText.includes("[READY]")) setReady(true);
    } catch {
      setMessages((prev) => {
        const msgs = [...prev];
        msgs[msgs.length - 1] = {
          role: "assistant",
          content: "¿Hay algo más que quieras agregar, o está bien así para continuar?",
        };
        return msgs;
      });
      setReady(true);
    } finally {
      setStreaming(false);
    }
  }

  const canSend = input.trim().length > 0 && !streaming;
  const isLastAssistant = (i: number) =>
    i === messages.length - 1 && messages[i].role === "assistant";

  return (
    <div>
      <span className="block w-8 h-0.5 bg-crimson-600 mb-5" />
      <h2 className="font-serif text-2xl font-bold text-gray-900 mb-1">Cuéntanos qué pasó</h2>
      <p className="text-xs text-gray-400 mb-4 flex items-center gap-1.5">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500" />
        Espacio seguro · Tu identidad está protegida
      </p>

      {/* Crisis banner */}
      <AnimatePresence>
        {crisis && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-3 bg-amber-50 border border-amber-200 px-4 py-3 mb-4"
          >
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-amber-800">Detectamos algo importante</p>
              <p className="text-xs text-amber-700 mt-0.5">
                Si estás en una situación de peligro o crisis, puedes llamar a la{" "}
                <strong>Línea de la Vida: 800 911 2000</strong> (gratuita, 24/7).
                Tu reporte también será atendido con máxima prioridad.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <div className="border border-crimson-100 bg-gray-50 flex flex-col h-72 mb-3 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <span className="w-5 h-5 rounded-full bg-crimson-600 flex items-center justify-center text-white text-[8px] font-bold mr-2 mt-1 shrink-0">
                    VE
                  </span>
                )}
                <div
                  className={`max-w-[82%] px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-crimson-600 text-white"
                      : "bg-white border border-crimson-100 text-gray-700"
                  }`}
                >
                  {msg.content}
                  {streaming && isLastAssistant(i) && <BlinkingCursor />}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>

        {/* Word count hint */}
        {wordCount > 0 && !canContinue && (
          <div className="px-4 py-1.5 border-t border-crimson-50 bg-white">
            <p className="text-[11px] text-gray-400">
              {wordCount < 8
                ? "Cuéntanos un poco más para que podamos ayudarte mejor..."
                : "Puedes continuar cuando quieras o añadir más detalles."}
            </p>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="flex gap-2 mb-4">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu mensaje..."
          className="resize-none rounded-none border-crimson-200 focus-visible:ring-0 focus-visible:border-crimson-500 text-sm"
          rows={2}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
          }}
        />
        <Button
          onClick={sendMessage}
          disabled={!canSend}
          className="bg-crimson-600 hover:bg-crimson-700 self-end rounded-none px-3.5 h-10"
          aria-label="Enviar"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
      <p className="text-[11px] text-gray-400 mb-4">Enter para enviar · Shift+Enter para nueva línea</p>

      {/* Summary + CTA */}
      <AnimatePresence>
        {canContinue && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {/* Summary card */}
            <div className="border border-crimson-100 bg-crimson-50/40 px-4 py-3.5">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-crimson-500 shrink-0" />
                <p className="text-[11px] font-semibold text-crimson-700 uppercase tracking-wide">
                  Lo que entendimos de tu reporte
                </p>
              </div>
              {summaryLoading || summary === null ? (
                <div className="flex items-center gap-2 py-1">
                  <Loader2 className="w-3.5 h-3.5 text-crimson-400 animate-spin" />
                  <p className="text-xs text-gray-400">Generando resumen...</p>
                </div>
              ) : summary ? (
                <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
              ) : null}
              {!summaryLoading && summary !== null && (
                <p className="text-[11px] text-gray-400 mt-2">
                  ¿No es correcto? Puedes seguir escribiendo para aclarar.
                </p>
              )}
            </div>

            <Button
              onClick={handleContinue}
              disabled={summaryLoading}
              className="w-full bg-crimson-600 hover:bg-crimson-700 rounded-none h-11 text-sm font-semibold tracking-wide gap-2 group"
            >
              Continuar con el reporte
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
