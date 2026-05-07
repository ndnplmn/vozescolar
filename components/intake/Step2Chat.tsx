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
      <h2 className="text-2xl font-bold text-navy-600 mb-2">Cuéntanos qué pasó</h2>
      <p className="text-xs text-gray-400 mb-4">Tu información está protegida</p>
      <div className="bg-gray-50 rounded-xl p-4 h-64 overflow-y-auto mb-4 space-y-3">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                msg.role === "user"
                  ? "bg-navy-600 text-white rounded-br-sm"
                  : "bg-white border border-gray-200 text-gray-700 rounded-bl-sm"
              }`}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-2">
              <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
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
          className="resize-none rounded-xl"
          rows={2}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
        />
        <Button onClick={sendMessage} disabled={loading || !input.trim()} className="bg-teal-600 hover:bg-teal-700 self-end rounded-xl px-4">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
