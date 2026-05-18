"use client";
import { useEffect, useState } from "react";
import { Complaint } from "@/lib/types";
import { SentimentGauge } from "./SentimentGauge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export function AIPanel({ complaint }: { complaint: Complaint }) {
  const [sentiment, setSentiment] = useState<{ score: number; summary: string } | null>(null);
  const [response, setResponse] = useState(complaint.adminResponse ?? "");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/ai/sentiment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: complaint.content }) }).then((r) => r.json()),
      fetch("/api/ai/suggest-response", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: complaint.content, category: complaint.category, urgency: complaint.urgency }) }).then((r) => r.json()),
    ]).then(([sent, sugg]) => {
      setSentiment(sent);
      if (!response) setResponse(sugg.response ?? "");
    }).finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [complaint.id]);

  async function handleSend() {
    setSending(true);
    const res = await fetch(`/api/complaints/${complaint.id}/response`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ response }),
    });
    if (res.ok) setSent(true);
    setSending(false);
  }

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 p-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Análisis de Sentimiento</p>
        {loading ? <Skeleton className="h-24 w-full" /> : sentiment && (
          <>
            <SentimentGauge score={sentiment.score} />
            <p className="text-sm text-gray-600 mt-3 text-center">{sentiment.summary}</p>
          </>
        )}
      </div>
      <div className="bg-white border border-gray-200 p-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Respuesta sugerida por IA</p>
        {loading ? <Skeleton className="h-32 w-full" /> : (
          <>
            <Textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              rows={5}
              className="text-sm resize-none rounded-none border-gray-200 mb-3"
            />
            {sent ? (
              <div className="flex items-center gap-2 text-crimson-600 text-sm">
                <CheckCircle2 className="w-4 h-4" /> Respuesta enviada
              </div>
            ) : (
              <Button
                onClick={handleSend}
                disabled={sending}
                className="w-full bg-crimson-600 hover:bg-crimson-700 rounded-none text-sm disabled:opacity-60"
              >
                {sending ? "Enviando..." : "Enviar respuesta oficial"}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
