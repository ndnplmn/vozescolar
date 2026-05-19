"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Category, Urgency } from "@/lib/types";
import { URGENCY_LABELS, URGENCY_COLORS } from "@/lib/utils";
import { Loader2, AlertTriangle, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const CATEGORIES: { value: Category; label: string; desc: string }[] = [
  { value: "acoso_escolar",  label: "Acoso escolar",    desc: "Bullying, hostigamiento o violencia entre alumnos" },
  { value: "docente",        label: "Docente",           desc: "Problemas con maestros o profesores" },
  { value: "infraestructura",label: "Infraestructura",   desc: "Instalaciones dañadas o en mal estado" },
  { value: "administrativo", label: "Administrativo",    desc: "Trámites, cuotas o personal de oficina" },
  { value: "seguridad",      label: "Seguridad",         desc: "Intrusos, armas, drogas o peligro físico" },
  { value: "otro",           label: "Otro",              desc: "Situación que no encaja en las anteriores" },
];

export function Step3Category({
  content,
  onComplete,
}: {
  content: string;
  onComplete: (category: Category, urgency: Urgency) => void;
}) {
  const [category, setCategory] = useState<Category | null>(null);
  const [urgency, setUrgency] = useState<Urgency | null>(null);
  const [loading, setLoading]   = useState(true);
  const [aiError, setAiError]   = useState(false);
  const [aiPicked, setAiPicked] = useState<Category | null>(null);

  useEffect(() => {
    fetch("/api/ai/classify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error || !data.category) { setAiError(true); return; }
        setCategory(data.category);
        setAiPicked(data.category);
        setUrgency(data.urgency);
      })
      .catch(() => setAiError(true))
      .finally(() => setLoading(false));
  }, [content]);

  const isModified = category !== aiPicked && aiPicked !== null;

  return (
    <div>
      <span className="block w-8 h-0.5 bg-crimson-600 mb-5" />
      <h2 className="font-serif text-2xl font-bold text-gray-900 mb-1">Categoría del reporte</h2>
      <p className="text-sm text-gray-500 mb-6">
        La inteligencia artificial identificó el tipo de situación. Puedes ajustarlo si no es correcto.
      </p>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-crimson-100 rounded-full" />
            <Loader2 className="w-12 h-12 text-crimson-600 animate-spin absolute inset-0" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700">Analizando tu reporte...</p>
            <p className="text-xs text-gray-400 mt-1">La IA está identificando la categoría</p>
          </div>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

          {/* AI error notice */}
          {aiError && (
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 px-3 py-2.5 mb-4">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">El asistente no pudo analizar tu reporte. Selecciona manualmente la categoría y urgencia.</p>
            </div>
          )}

          {/* AI selection indicator */}
          {aiPicked && !isModified && (
            <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
              <Sparkles className="w-3.5 h-3.5 text-crimson-400 shrink-0" />
              <span>La IA detectó: <strong className="text-gray-700">{CATEGORIES.find(c => c.value === aiPicked)?.label}</strong></span>
            </div>
          )}
          {isModified && (
            <div className="flex items-center gap-2 mb-4 text-xs text-amber-600">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>Categoría ajustada manualmente</span>
            </div>
          )}

          {/* Urgency badge (AI-assigned) */}
          {urgency && !aiError && (
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 border text-xs font-semibold mb-4 ${URGENCY_COLORS[urgency]}`}>
              Urgencia detectada: {URGENCY_LABELS[urgency]}
            </div>
          )}

          {/* Manual urgency selector (when AI failed) */}
          {aiError && (
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2 font-medium">¿Qué tan urgente es esta situación?</p>
              <div className="flex flex-wrap gap-2">
                {(["critical","high","medium","low"] as Urgency[]).map(u => (
                  <button
                    key={u}
                    onClick={() => setUrgency(u)}
                    className={`px-3 py-1.5 border text-xs font-semibold transition-all ${
                      urgency === u ? URGENCY_COLORS[u] : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    {URGENCY_LABELS[u]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Critical alert */}
          <AnimatePresence>
            {urgency === "critical" && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 bg-red-50 border border-red-200 px-4 py-3 mb-5"
              >
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-red-800">Reporte crítico</p>
                  <p className="text-xs text-red-700 mt-0.5">Este caso será atendido con máxima prioridad por la dirección del CETIS 52.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Category grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
            {CATEGORIES.map(({ value, label, desc }) => {
              const isSelected = category === value;
              const isAI = aiPicked === value;
              return (
                <button
                  key={value}
                  onClick={() => setCategory(value)}
                  className={`p-3.5 border-2 text-left transition-all group ${
                    isSelected
                      ? "border-crimson-600 bg-crimson-50"
                      : "border-gray-200 hover:border-crimson-300 hover:bg-crimson-50/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className={`text-sm font-semibold leading-tight ${isSelected ? "text-crimson-700" : "text-gray-700"}`}>
                        {label}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 leading-snug">{desc}</p>
                    </div>
                    {isAI && (
                      <span className="text-[9px] font-bold tracking-wide text-crimson-400 uppercase shrink-0 mt-0.5">IA</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <Button
            onClick={() => category && urgency && onComplete(category, urgency)}
            disabled={!category || !urgency}
            className="w-full bg-crimson-600 hover:bg-crimson-700 rounded-none h-11 text-sm font-semibold gap-2 group"
          >
            Confirmar categoría
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}
