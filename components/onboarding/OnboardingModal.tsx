"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, FileText, Search, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const ONBOARDING_KEY = "vozescolar_onboarding_done";

const STEPS = [
  {
    icon: Shield,
    title: "Tu identidad está 100% protegida",
    body: "VozEscolar es un canal completamente confidencial. No registramos tu nombre, IP, ni ningún dato que pueda identificarte. Puedes reportar con total tranquilidad.",
    highlight: "Sin nombre. Sin dirección. Sin rastro.",
  },
  {
    icon: FileText,
    title: "Describe lo que ocurrió",
    body: "Un asistente de IA te guiará con preguntas simples para que tu reporte sea claro y llegue al área correcta. El proceso toma menos de 5 minutos.",
    highlight: "La IA clasifica tu reporte automáticamente.",
  },
  {
    icon: Search,
    title: "Monitorea tu reporte con tu folio",
    body: "Al enviar, recibirás un número de folio único. Úsalo en cualquier momento para consultar el estado de tu reporte y ver la respuesta del CETIS 52.",
    highlight: "Guarda tu folio — es tu llave de seguimiento.",
  },
];

export function OnboardingModal() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const done = localStorage.getItem(ONBOARDING_KEY);
      if (!done) setVisible(true);
    }
  }, []);

  function dismiss() {
    localStorage.setItem(ONBOARDING_KEY, "1");
    setVisible(false);
  }

  const current = STEPS[step];
  const Icon = current.icon;
  const isLast = step === STEPS.length - 1;

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50"
            onClick={dismiss}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-white border border-crimson-200 overflow-hidden">
              {/* Top accent bar */}
              <div className="h-1 bg-crimson-600" />

              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-5 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold tracking-widest text-crimson-600 uppercase">VozEscolar</span>
                  <span className="text-gray-300">·</span>
                  <span className="text-[10px] text-gray-400">Guía rápida</span>
                </div>
                <button
                  onClick={dismiss}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Cerrar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Step content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.2 }}
                  className="px-6 py-6"
                >
                  <div className="flex items-center justify-center mb-5">
                    <div className="bg-crimson-50 border border-crimson-100 p-4">
                      <Icon className="w-8 h-8 text-crimson-600" />
                    </div>
                  </div>
                  <h2 className="font-serif text-xl font-bold text-gray-900 text-center mb-3 leading-tight">
                    {current.title}
                  </h2>
                  <p className="text-sm text-gray-500 text-center leading-relaxed mb-4">
                    {current.body}
                  </p>
                  <div className="bg-crimson-50 border border-crimson-100 px-4 py-2.5 text-center">
                    <p className="text-xs font-semibold text-crimson-700">{current.highlight}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Step dots */}
              <div className="flex items-center justify-center gap-2 pb-2">
                {STEPS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setStep(i)}
                    className={`transition-all ${
                      i === step
                        ? "w-5 h-1.5 bg-crimson-600"
                        : "w-1.5 h-1.5 bg-crimson-200"
                    }`}
                    aria-label={`Paso ${i + 1}`}
                  />
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 px-6 pb-6 pt-3">
                {step > 0 && (
                  <button
                    onClick={() => setStep((s) => s - 1)}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Anterior
                  </button>
                )}
                <div className="flex-1" />
                {!isLast ? (
                  <Button
                    onClick={() => setStep((s) => s + 1)}
                    className="bg-crimson-600 hover:bg-crimson-700 rounded-none text-sm px-6 gap-1.5"
                  >
                    Siguiente <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                ) : (
                  <Button
                    onClick={dismiss}
                    className="bg-crimson-600 hover:bg-crimson-700 rounded-none text-sm px-6"
                  >
                    Entendido, empezar
                  </Button>
                )}
              </div>

              {/* Skip */}
              <div className="text-center pb-4 -mt-2">
                <button onClick={dismiss} className="text-xs text-gray-400 hover:text-gray-500 transition-colors underline underline-offset-2">
                  Omitir guía
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
