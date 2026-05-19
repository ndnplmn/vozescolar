"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Category, Urgency, Role } from "@/lib/types";
import { CATEGORY_LABELS, URGENCY_LABELS, URGENCY_COLORS, ROLE_LABELS } from "@/lib/utils";
import { Shield, ChevronDown, Lock, Loader2, Send, Paperclip } from "lucide-react";

export function Step5Confirm({
  role,
  content,
  category,
  urgency,
  evidenceName,
  onSubmit,
}: {
  role: Role;
  content: string;
  category: Category;
  urgency: Urgency;
  evidenceName?: string;
  onSubmit: (isAnonymous: boolean) => void;
}) {
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [loading, setLoading] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [contentExpanded, setContentExpanded] = useState(false);

  const isLong = content.length > 220;

  async function handleSubmit() {
    setLoading(true);
    await onSubmit(isAnonymous);
  }

  return (
    <div>
      <span className="block w-8 h-0.5 bg-crimson-600 mb-5" />
      <h2 className="font-serif text-2xl font-bold text-gray-900 mb-1">Confirmar reporte</h2>
      <p className="text-sm text-gray-500 mb-6">Revisa los detalles antes de enviar.</p>

      {/* Summary card */}
      <div className="border border-crimson-100 bg-gray-50 p-4 mb-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Rol</span>
          <span className="font-medium text-gray-800">{ROLE_LABELS[role]}</span>
        </div>
        <div className="border-t border-crimson-100 pt-3 flex justify-between text-sm">
          <span className="text-gray-500">Categoría</span>
          <span className="font-medium text-gray-800">{CATEGORY_LABELS[category]}</span>
        </div>
        <div className="border-t border-crimson-100 pt-3 flex justify-between text-sm items-center">
          <span className="text-gray-500">Urgencia</span>
          <span className={`text-xs px-2 py-0.5 border font-medium ${URGENCY_COLORS[urgency]}`}>
            {URGENCY_LABELS[urgency]}
          </span>
        </div>
        <div className="border-t border-crimson-100 pt-3 text-sm">
          <span className="text-gray-500">Descripción</span>
          <div className="mt-1 relative">
            <p className={`text-gray-700 leading-relaxed text-sm ${!contentExpanded && isLong ? "line-clamp-3" : ""}`}>
              {content}
            </p>
            {isLong && (
              <button
                onClick={() => setContentExpanded((v) => !v)}
                className="mt-1 text-xs text-crimson-600 hover:text-crimson-700 font-medium transition-colors"
              >
                {contentExpanded ? "Ver menos" : "Ver completo"}
              </button>
            )}
          </div>
        </div>
        <div className="border-t border-crimson-100 pt-3 flex justify-between text-sm items-center">
          <span className="text-gray-500">Evidencia</span>
          {evidenceName ? (
            <span className="inline-flex items-center gap-1.5 text-xs text-crimson-700 font-medium">
              <Paperclip className="w-3 h-3" />
              {evidenceName}
            </span>
          ) : (
            <span className="text-xs text-gray-400 italic">No adjuntada</span>
          )}
        </div>
      </div>

      {/* Anonymous toggle */}
      <div className="border border-crimson-200 bg-crimson-50 mb-2">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-crimson-600" />
            <div>
              <p className="text-sm font-medium text-gray-800">Modo anónimo</p>
              <p className="text-xs text-gray-500">No se guardará ningún dato personal</p>
            </div>
          </div>
          <Switch checked={isAnonymous} onCheckedChange={setIsAnonymous} disabled={loading} />
        </div>
      </div>

      {/* Privacy micro-accordion */}
      <div className="border border-t-0 border-crimson-100 mb-6">
        <button
          onClick={() => setPrivacyOpen((v) => !v)}
          className="w-full flex items-center gap-2 px-4 py-2.5 text-left hover:bg-gray-50 transition-colors"
        >
          <Lock className="w-3.5 h-3.5 text-crimson-400 shrink-0" />
          <span className="text-xs text-gray-500 flex-1">¿Cómo protegemos tu privacidad?</span>
          <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${privacyOpen ? "rotate-180" : ""}`} />
        </button>
        <AnimatePresence initial={false}>
          {privacyOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 pt-1 space-y-2">
                {[
                  "No almacenamos tu dirección IP ni datos de sesión.",
                  "El reporte se asocia a un folio aleatorio, nunca a tu identidad.",
                  "Solo el personal autorizado del CETIS 52 puede leer tu reporte.",
                  "El reportado nunca sabe quién hizo la denuncia.",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <span className="text-crimson-400 text-xs mt-0.5">✓</span>
                    <p className="text-xs text-gray-500 leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-crimson-600 hover:bg-crimson-700 rounded-none h-12 text-sm font-semibold tracking-wide gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Enviando reporte...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Enviar reporte
          </>
        )}
      </Button>

      <p className="text-center text-[11px] text-gray-400 mt-3 flex items-center justify-center gap-1">
        <Lock className="w-3 h-3" />
        Enviado como: <span className="font-semibold">{isAnonymous ? "Anónimo" : "Identificado"}</span>
      </p>
    </div>
  );
}
