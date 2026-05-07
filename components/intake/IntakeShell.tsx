"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StepIndicator } from "./StepIndicator";
import { Step1Role } from "./Step1Role";
import { Step2Chat } from "./Step2Chat";
import { Step3Category } from "./Step3Category";
import { Step4Evidence } from "./Step4Evidence";
import { Step5Confirm } from "./Step5Confirm";
import { Role, Category, Urgency, Complaint, TimelineEntry } from "@/lib/types";
import { generateFolio, hashContent } from "@/lib/utils";
import { saveComplaint, StorageFullError } from "@/lib/storage";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export function IntakeShell() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [storageError, setStorageError] = useState(false);

  // Warn before leaving mid-flow
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

  async function handleSubmit(isAnonymous: boolean) {
    setSubmitted(true);
    const folio = generateFolio();
    const hash = await hashContent(content);
    const now = new Date().toISOString();
    const timeline: TimelineEntry[] = [{ status: "recibida", timestamp: now }];
    const complaint: Complaint = {
      id: crypto.randomUUID(),
      folio,
      role,
      content,
      category,
      urgency,
      status: "recibida",
      isAnonymous,
      contentHash: hash,
      createdAt: now,
      timeline,
      evidenceBase64,
      evidenceName,
    };
    try {
      saveComplaint(complaint);
    } catch (e) {
      setSubmitted(false);
      if (e instanceof StorageFullError) {
        setStorageError(true);
      }
      return;
    }
    router.push(`/seguimiento/${folio}?nuevo=true`);
  }

  const TOTAL = 5;
  const progress = Math.round(((step + 1) / TOTAL) * 100);

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d * 28 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d * -28 }),
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-crimson-200 sticky top-0 bg-white z-30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3.5">
            <Image src="/cetis52-logo.svg" alt="CETIS 52" width={36} height={36} />
            <div>
              <p className="text-[10px] font-bold tracking-[0.18em] text-crimson-600 uppercase leading-none mb-0.5">CETIS 52</p>
              <p className="text-xs font-medium text-gray-700 leading-none">Hermenegildo Galeana</p>
            </div>
          </Link>
          <span className="text-xs text-gray-400 hidden sm:block font-medium tracking-wide">Canal confidencial · Buzón oficial</span>
        </div>
      </header>

      <main className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-lg">

          {/* Storage full error */}
          {storageError && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 px-4 py-3 mb-4">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-red-800">No fue posible guardar el reporte</p>
                <p className="text-xs text-red-700 mt-0.5">
                  El almacenamiento del navegador está lleno. Intenta desde otro navegador o dispositivo.
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
            {/* Step header with back button */}
            <div className="flex items-center justify-between px-8 pt-6 pb-0">
              {step > 0 ? (
                <button
                  onClick={back}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-crimson-600 transition-colors group"
                >
                  <ChevronLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                  Volver
                </button>
              ) : (
                <span />
              )}
              <span className="text-[11px] text-gray-400 tabular-nums font-medium">
                {step + 1} <span className="text-gray-300">/ {TOTAL}</span>
              </span>
            </div>

            {/* Step content */}
            <div className="px-8 pb-8 pt-4">
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
                  {step === 4 && <Step5Confirm role={role} content={content} category={category} urgency={urgency} onSubmit={handleSubmit} />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom security note */}
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
    </div>
  );
}
