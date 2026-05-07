"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Role } from "@/lib/types";
import { Send, Loader2 } from "lucide-react";

interface Message { role: "assistant" | "user"; content: string; }

export function Step2Chat({
  userRole,
  onComplete,
}: {
  userRole: Role;
  onComplete: (content: string, messages: Message[]) => void;
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hola, este es un espacio seguro. Cuéntame con tus propias palabras qué situación quieres reportar. No tienes que dar tu nombre ni información personal.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [turnCount, setTurnCount] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setTurnCount((t) => t + 1);

    if (turnCount >= 2) {
      onComplete(newMessages.filter((m) => m.role === "user").map((m) => m.content).join(" "), newMessages);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/ai/followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: userRole, messages: newMessages }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.question }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <span className="block w-8 h-0.5 bg-crimson-600 mb-5" />
      <h2 className="font-serif text-2xl font-bold text-gray-900 mb-1">Cuéntanos qué pasó</h2>
      <p className="text-xs text-gray-400 mb-4">Tu información está protegida</p>
      <div className="bg-gray-50 border border-crimson-100 p-4 h-64 overflow-y-auto mb-4 space-y-3">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[80%] px-4 py-2 text-sm ${
                msg.role === "user"
                  ? "bg-crimson-600 text-white"
                  : "bg-white border border-crimson-100 text-gray-700"
              }`}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-crimson-100 px-4 py-2">
              <Loader2 className="w-4 h-4 animate-spin text-crimson-600" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="flex gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe aquí..."
          className="resize-none rounded-none border-crimson-200 focus:border-crimson-600"
          rows={2}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
        />
        <Button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="bg-crimson-600 hover:bg-crimson-700 self-end rounded-none px-4"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
