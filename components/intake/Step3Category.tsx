"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Category, Urgency } from "@/lib/types";
import { CATEGORY_LABELS, URGENCY_LABELS, URGENCY_COLORS } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const CATEGORIES: Category[] = ["acoso_escolar","docente","infraestructura","administrativo","seguridad","otro"];

export function Step3Category({
  content,
  onComplete,
}: {
  content: string;
  onComplete: (category: Category, urgency: Urgency) => void;
}) {
  const [category, setCategory] = useState<Category | null>(null);
  const [urgency, setUrgency] = useState<Urgency | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/ai/classify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    })
      .then((r) => r.json())
      .then((data) => { setCategory(data.category); setUrgency(data.urgency); })
      .finally(() => setLoading(false));
  }, [content]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-navy-600 mb-2">Categoría detectada</h2>
      <p className="text-gray-500 mb-6">La IA identificó el tipo de reporte. Puedes ajustarlo si es necesario.</p>
      {loading ? (
        <div className="flex items-center gap-3 text-gray-500"><Loader2 className="animate-spin w-5 h-5 text-teal-600" /> Analizando tu reporte...</div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {urgency && (
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium mb-4 ${URGENCY_COLORS[urgency]}`}>
              Urgencia: {URGENCY_LABELS[urgency]}
            </div>
          )}
          {urgency === "critical" && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-sm text-red-700">
              Este reporte fue marcado como crítico. Será atendido con máxima prioridad.
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                  category === cat ? "border-teal-500 bg-teal-50 text-teal-700" : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
          <Button
            onClick={() => category && urgency && onComplete(category, urgency)}
            disabled={!category || !urgency}
            className="w-full bg-navy-600 hover:bg-navy-700 rounded-xl"
          >
            Continuar
          </Button>
        </motion.div>
      )}
    </div>
  );
}
