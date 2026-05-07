"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StepIndicator } from "./StepIndicator";
import { Step1Role } from "./Step1Role";
import { Step2Chat } from "./Step2Chat";
import { Step3Category } from "./Step3Category";
import { Step4Evidence } from "./Step4Evidence";
import { Step5Confirm } from "./Step5Confirm";
import { Role, Category, Urgency, Complaint, TimelineEntry } from "@/lib/types";
import { generateFolio, hashContent } from "@/lib/utils";
import { saveComplaint } from "@/lib/storage";
import { useRouter } from "next/navigation";

export function IntakeShell() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<Role>("alumno");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<Category>("otro");
  const [urgency, setUrgency] = useState<Urgency>("medium");
  const [evidenceBase64, setEvidenceBase64] = useState<string | undefined>();
  const [evidenceName, setEvidenceName] = useState<string | undefined>();

  async function handleSubmit(isAnonymous: boolean) {
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
    saveComplaint(complaint);
    router.push(`/seguimiento/${folio}?nuevo=true`);
  }

  const variants = {
    enter: { opacity: 0, x: 20 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-50 to-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <StepIndicator current={step} />
        <AnimatePresence mode="wait">
          <motion.div key={step} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
            {step === 0 && <Step1Role onSelect={(r) => { setRole(r); setStep(1); }} />}
            {step === 1 && <Step2Chat userRole={role} onComplete={(c) => { setContent(c); setStep(2); }} />}
            {step === 2 && <Step3Category content={content} onComplete={(cat, urg) => { setCategory(cat); setUrgency(urg); setStep(3); }} />}
            {step === 3 && <Step4Evidence onComplete={(b64, name) => { setEvidenceBase64(b64); setEvidenceName(name); setStep(4); }} />}
            {step === 4 && <Step5Confirm role={role} content={content} category={category} urgency={urgency} onSubmit={handleSubmit} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
