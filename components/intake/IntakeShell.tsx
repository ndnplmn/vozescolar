"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StepIndicator } from "./StepIndicator";
import { Step1Role } from "./Step1Role";
import { Step2Chat } from "./Step2Chat";
import { Step3Category } from "./Step3Category";
import { Step4Evidence } from "./Step4Evidence";
import { Step5Confirm } from "./Step5Confirm";
import { Role, Category, Urgency } from "@/lib/types";
import { AlertTriangle, X, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { DEFAULT_SCHOOL_CONFIG } from "@/lib/config";

export function IntakeShell() {
  const router = useRouter();
  const [schoolConfig, setSchoolConfig] = useState(DEFAULT_SCHOOL_CONFIG);
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setSchoolConfig(d); })
      .catch(() => {});
  }, []);

  // Warn before browser navigation mid-flow
  useEffect(() => {
    if (step === 0 || submitted) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [step, submitted]);

  const [dir, setDir] = useState(1);
  const [role, setRole] = useState<Role>("alumno");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<Category>("otro");
  const [urgency, setUrgency] = useState<Urgency>("medium");
  const [evidenceBase64, setEvidenceBase64] = useState<string | undefined>();
  const [evidenceName, setEvidenceName] = useState<string | undefined>();

  function advance(nextStep: number) {
    setDir(1);
    setStep(nextStep);
  }

  function back() {
    if (step === 0) return;
    setDir(-1);
    setStep((s) => s - 1);
  }

  function handleLogoClick(e: React.MouseEvent) {
    if (step > 0 && !submitted) {
      e.preventDefault();
      setConfirmLeave(true);
    }
  }

  async function handleSubmit(isAnonymous: boolean) {
    setSubmitted(true);
    setSubmitError(false);

    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          content,
          category,
          urgency,
          isAnonymous,
          evidenceBase64: evidenceBase64 ?? null,
          evidenceName:   evidenceName   ?? null,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.folio) {
        setSubmitted(false);
        setSubmitError(true);
        return;
      }

      router.push(`/seguimiento/${data.folio}?nuevo=true`);
    } catch {
      setSubmitted(false);
      setSubmitError(true);
    }
  }

  const TOTAL = 5;
  const progress = Math.round(((step + 1) / TOTAL) * 100);

  const variants = {
    enter:  (d: number) => ({ opacity: 0, x: d * 28 }),
    center: { opacity: 1, x: 0 },
    exit:   (d: number) => ({ opacity: 0, x: d * -28 }),
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-crimson-200 sticky top-0 bg-white z-30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" onClick={handleLogoClick} className="flex items-center gap-3.5 cursor-pointer">
            <Image src={schoolConfig.logoUrl} alt={schoolConfig.shortName} width={36} height={36} />
            <div>
              <p className="text-[10px] font-bold tracking-[0.18em] text-crimson-600 uppercase leading-none mb-0.5">{schoolConfig.shortName}</p>
              <p className="text-xs font-medium text-gray-700 leading-none">{schoolConfig.name.replace(schoolConfig.shortName, "").trim()}</p>
            </div>
          </a>
          <span className="text-xs text-gray-400 hidden sm:block font-medium tracking-wide">Canal confidencial · Buzón oficial</span>
        </div>
      </header>

      <main className="flex-1 flex items-start justify-center px-3 sm:px-4 py-4 sm:py-10">
        <div className="w-full max-w-lg">

          {submitError && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 px-4 py-3 mb-4">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-red-800">No fue posible enviar el reporte</p>
                <p className="text-xs text-red-700 mt-0.5">
                  Ocurrió un error al guardar. Verifica tu conexión e intenta de nuevo.
                </p>
              </div>
            </div>
          )}

          {/* Progress bar */}
          <div className="h-0.5 bg-crimson-100 mb-0 overflow-hidden">
            <motion.div
              className="h-full bg-crimson-600"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            />
          </div>

          <div className="border border-t-0 border-crimson-200 bg-white">
            <div className="flex items-center justify-between px-5 sm:px-8 pt-5 sm:pt-6 pb-0">
              {step > 0 ? (
                <button
                  onClick={back}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-crimson-600 transition-colors group min-h-[44px] sm:min-h-0"
                >
                  <ChevronLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                  Volver
                </button>
              ) : <span />}
              <span className="text-[11px] text-gray-400 tabular-nums font-medium">
                {step + 1} <span className="text-gray-300">/ {TOTAL}</span>
              </span>
            </div>

            <div className="px-5 sm:px-8 pb-6 sm:pb-8 pt-4">
              <StepIndicator current={step} />
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={step}
                  custom={dir}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.22, ease: "easeOut" }}
                >
                  {step === 0 && <Step1Role onSelect={(r) => { setRole(r); advance(1); }} />}
                  {step === 1 && <Step2Chat userRole={role} onComplete={(c) => { setContent(c); advance(2); }} />}
                  {step === 2 && <Step3Category content={content} onComplete={(cat, urg) => { setCategory(cat); setUrgency(urg); advance(3); }} />}
                  {step === 3 && <Step4Evidence onComplete={(b64, name) => { setEvidenceBase64(b64); setEvidenceName(name); advance(4); }} />}
                  {step === 4 && (
                    <Step5Confirm
                      role={role}
                      content={content}
                      category={category}
                      urgency={urgency}
                      evidenceName={evidenceName}
                      onSubmit={handleSubmit}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <p className="text-center text-[11px] text-gray-400 mt-4">
            Conexión segura · Sin registro de IP · 100% confidencial
          </p>
        </div>
      </main>

      <footer className="border-t border-crimson-100 py-4">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-xs text-gray-400">
          <span>© {new Date().getFullYear()} CETIS 52 Hermenegildo Galeana</span>
          <span className="text-crimson-600 font-medium">VozEscolar</span>
        </div>
      </footer>

      {/* Leave confirmation modal */}
      <AnimatePresence>
        {confirmLeave && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setConfirmLeave(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="bg-white w-full max-w-sm p-6 shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-red-50 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">¿Salir del formulario?</p>
                    <p className="text-xs text-gray-500 mt-0.5">Tu progreso se perderá.</p>
                  </div>
                </div>
                <button onClick={() => setConfirmLeave(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmLeave(false)}
                  className="flex-1 h-10 border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors font-medium"
                >
                  Continuar reporte
                </button>
                <a
                  href="/"
                  className="flex-1 h-10 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold flex items-center justify-center transition-colors"
                >
                  Salir
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
