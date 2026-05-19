"use client";
import { useEffect, useState } from "react";
import { Complaint } from "@/lib/types";
import { SentimentGauge } from "./SentimentGauge";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Send, CheckCircle2, RefreshCw } from "lucide-react";

export function AIPanel({ complaint }: { complaint: Complaint }) {
  const [sentiment, setSentiment] = useState<{ score: number; summary: string } | null>(null);
  const [response, setResponse] = useState(complaint.adminResponse ?? "");
  const [sent, setSent] = useState(!!complaint.adminResponse);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  async function fetchAI() {
    setLoading(true);
    const [sentRes, suggRes] = await Promise.all([
      fetch("/api/ai/sentiment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: complaint.content }) }).then(r => r.json()),
      fetch("/api/ai/suggest-response", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: complaint.content, category: complaint.category, urgency: complaint.urgency }) }).then(r => r.json()),
    ]);
    setSentiment(sentRes);
    if (!response && !complaint.adminResponse) setResponse(suggRes.response ?? "");
    setLoading(false);
  }

  useEffect(() => { fetchAI(); }, [complaint.id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleRegenerate() {
    setRegenerating(true);
    const res = await fetch("/api/ai/suggest-response", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: complaint.content, category: complaint.category, urgency: complaint.urgency }),
    }).then(r => r.json());
    setResponse(res.response ?? "");
    setRegenerating(false);
  }

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

      {/* Sentiment */}
      <div className="bg-white border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 bg-crimson-600/10 rounded flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-crimson-600" />
          </div>
          <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Análisis de Sentimiento</p>
        </div>

        {loading ? (
          <div className="space-y-3 py-2">
            <div className="h-20 bg-gray-100 animate-pulse" />
            <div className="h-3 bg-gray-100 animate-pulse w-3/4 mx-auto" />
          </div>
        ) : sentiment ? (
          <>
            <SentimentGauge score={sentiment.score} />
            <p className="text-xs text-gray-500 text-center mt-3 leading-relaxed">{sentiment.summary}</p>
          </>
        ) : null}
      </div>

      {/* Response */}
      <div className="bg-white border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-crimson-600/10 rounded flex items-center justify-center">
              <Send className="w-3 h-3 text-crimson-600" />
            </div>
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Respuesta oficial</p>
          </div>
          {!loading && !sent && (
            <button
              onClick={handleRegenerate}
              disabled={regenerating}
              className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-crimson-600 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${regenerating ? "animate-spin" : ""}`} />
              Nueva sugerencia
            </button>
          )}
        </div>

        {loading ? (
          <div className="space-y-2">
            <div className="h-4 bg-gray-100 animate-pulse" />
            <div className="h-4 bg-gray-100 animate-pulse w-5/6" />
            <div className="h-4 bg-gray-100 animate-pulse w-4/6" />
          </div>
        ) : (
          <>
            <Textarea
              value={response}
              onChange={(e) => { setResponse(e.target.value); setSent(false); }}
              rows={6}
              placeholder="Escribe o edita la respuesta oficial para el reportante..."
              className="text-sm resize-none rounded-none border-gray-200 focus:border-crimson-400 focus-visible:ring-0 focus-visible:ring-offset-0 mb-3 leading-relaxed"
            />

            {sent ? (
              <div className="flex items-center gap-2 py-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-green-700">Respuesta enviada</p>
                  <p className="text-xs text-green-600">El reportante puede verla en su folio.</p>
                </div>
              </div>
            ) : (
              <button
                onClick={handleSend}
                disabled={sending || !response.trim()}
                className="w-full h-10 bg-crimson-600 hover:bg-crimson-700 disabled:opacity-50 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {sending ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Enviando...
                  </>
                ) : (
                  <><Send className="w-3.5 h-3.5" /> Enviar respuesta oficial</>
                )}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
