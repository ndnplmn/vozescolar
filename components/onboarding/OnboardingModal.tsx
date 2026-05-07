"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, MessageSquare, Hash, ArrowRight } from "lucide-react";
import Image from "next/image";

const ONBOARDING_KEY = "vozescolar_onboarding_done";

const STEPS = [
  {
    n: "01",
    Icon: ShieldCheck,
    label: "Confidencialidad",
    title: "Tu identidad nunca es revelada.",
    body: "VozEscolar no registra tu nombre, dirección IP ni ningún dato que pueda identificarte. Puedes reportar con absoluta tranquilidad — el sistema está diseñado para protegerte desde el primer clic.",
    stat: "0 datos personales almacenados",
  },
  {
    n: "02",
    Icon: MessageSquare,
    label: "Proceso",
    title: "Cuéntanos lo que pasó.",
    body: "Un asistente de inteligencia artificial te guía con preguntas simples y precisas. No necesitas saber redactar formalmente. El proceso completo toma menos de cinco minutos.",
    stat: "< 5 minutos para completar tu reporte",
  },
  {
    n: "03",
    Icon: Hash,
    label: "Seguimiento",
    title: "Monitorea cada etapa con tu folio.",
    body: "Al enviar tu reporte recibirás un número de folio único. Guárdalo: es tu única llave para consultar el estado de tu caso y leer la respuesta oficial del CETIS 52 en cualquier momento.",
    stat: "Respuesta garantizada dentro de 48 h",
  },
];

export function OnboardingModal() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem(ONBOARDING_KEY)) {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    localStorage.setItem(ONBOARDING_KEY, "1");
    setVisible(false);
  }

  function go(next: number) {
    setDir(next > step ? 1 : -1);
    setStep(next);
  }

  const current = STEPS[step];
  const { Icon } = current;
  const isLast = step === STEPS.length - 1;

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d * 28 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d * -28 }),
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-2xl overflow-hidden grid grid-cols-1 md:grid-cols-5 shadow-2xl">

              {/* ── LEFT PANEL — crimson ── */}
              <div className="md:col-span-2 bg-crimson-600 relative flex flex-col items-center justify-center py-12 px-8 overflow-hidden min-h-[160px] md:min-h-0">
                {/* Watermark number */}
                <span
                  className="absolute font-serif font-bold text-white select-none pointer-events-none"
                  style={{ fontSize: "clamp(80px, 12vw, 140px)", opacity: 0.08, bottom: "-12px", right: "8px", lineHeight: 1 }}
                >
                  {current.n}
                </span>

                {/* Logo */}
                <div className="mb-6 opacity-90">
                  <Image src="/cetis52-logo.svg" alt="CETIS 52" width={52} height={52} />
                </div>

                {/* Icon */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="mb-5"
                  >
                    <Icon className="w-12 h-12 text-white" strokeWidth={1.5} />
                  </motion.div>
                </AnimatePresence>

                {/* Label */}
                <p className="text-[10px] font-bold tracking-[0.2em] text-white/60 uppercase">{current.label}</p>

                {/* Step dots */}
                <div className="flex items-center gap-2 mt-6">
                  {STEPS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => go(i)}
                      aria-label={`Paso ${i + 1}`}
                      className={`transition-all duration-300 rounded-none ${
                        i === step ? "w-6 h-1 bg-white" : "w-1.5 h-1.5 bg-white/30"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* ── RIGHT PANEL — white ── */}
              <div className="md:col-span-3 bg-white flex flex-col">
                {/* Header row */}
                <div className="flex items-center justify-between px-8 pt-7 pb-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold tracking-[0.18em] text-crimson-600 uppercase">VozEscolar</span>
                    <span className="text-gray-300 text-xs">·</span>
                    <span className="text-[10px] text-gray-400 tabular-nums">{step + 1} / {STEPS.length}</span>
                  </div>
                  <button
                    onClick={dismiss}
                    className="text-gray-300 hover:text-gray-500 transition-colors p-1"
                    aria-label="Cerrar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 px-8 py-8 flex flex-col justify-center">
                  <AnimatePresence mode="wait" custom={dir}>
                    <motion.div
                      key={step}
                      custom={dir}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.28, ease: "easeOut" }}
                    >
                      <span className="block w-8 h-0.5 bg-crimson-600 mb-6" />

                      <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-4">
                        {current.title}
                      </h2>

                      <p className="text-sm text-gray-500 leading-relaxed mb-6">
                        {current.body}
                      </p>

                      {/* Stat callout */}
                      <div className="flex items-center gap-3">
                        <span className="block w-1 h-8 bg-crimson-600 shrink-0" />
                        <p className="text-xs font-semibold text-gray-700">{current.stat}</p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="px-8 pb-7 flex items-center justify-between gap-4">
                  <button
                    onClick={dismiss}
                    className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    Omitir
                  </button>

                  <div className="flex items-center gap-3">
                    {step > 0 && (
                      <button
                        onClick={() => go(step - 1)}
                        className="text-xs text-gray-400 hover:text-crimson-600 transition-colors"
                      >
                        Anterior
                      </button>
                    )}
                    <button
                      onClick={() => isLast ? dismiss() : go(step + 1)}
                      className="flex items-center gap-2 bg-crimson-600 hover:bg-crimson-700 text-white text-sm font-semibold px-6 py-2.5 transition-colors"
                    >
                      {isLast ? "Comenzar" : "Siguiente"}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
