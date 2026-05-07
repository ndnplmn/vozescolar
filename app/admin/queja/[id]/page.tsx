"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { MOCK_COMPLAINTS } from "@/lib/mock-data";
import { getLocalComplaints, updateComplaint } from "@/lib/storage";
import { Complaint, Status, TimelineEntry } from "@/lib/types";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AIPanel } from "@/components/admin/AIPanel";
import { CATEGORY_LABELS, URGENCY_LABELS, URGENCY_COLORS, STATUS_LABELS, ROLE_LABELS } from "@/lib/utils";
import { ArrowLeft, CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_FLOW: Status[] = ["recibida", "en_revision", "en_proceso", "resuelta"];
const STATUS_NEXT_LABEL: Partial<Record<Status, string>> = {
  recibida:    "Marcar en revisión",
  en_revision: "Marcar en proceso",
  en_proceso:  "Marcar como resuelta",
};
const STATUS_COLORS: Record<Status, string> = {
  recibida:    "bg-gray-100 text-gray-600 border-gray-200",
  en_revision: "bg-blue-50 text-blue-700 border-blue-200",
  en_proceso:  "bg-amber-50 text-amber-700 border-amber-200",
  resuelta:    "bg-green-50 text-green-700 border-green-200",
  cerrada:     "bg-gray-100 text-gray-500 border-gray-200",
};

export default function ComplaintDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [advancing, setAdvancing] = useState(false);
  const [justAdvanced, setJustAdvanced] = useState(false);

  useEffect(() => {
    const all = [...getLocalComplaints(), ...MOCK_COMPLAINTS];
    setComplaint(all.find((c) => c.id === id) ?? null);
  }, [id]);

  const advanceStatus = useCallback(() => {
    if (!complaint) return;
    const currentIdx = STATUS_FLOW.indexOf(complaint.status as Status);
    if (currentIdx === -1 || currentIdx >= STATUS_FLOW.length - 1) return;

    setAdvancing(true);
    const nextStatus = STATUS_FLOW[currentIdx + 1];
    const newEntry: TimelineEntry = { status: nextStatus, timestamp: new Date().toISOString() };
    const updatedTimeline = [...complaint.timeline, newEntry];

    updateComplaint(complaint.id, { status: nextStatus, timeline: updatedTimeline });
    setComplaint((prev) => prev ? { ...prev, status: nextStatus, timeline: updatedTimeline } : null);

    setTimeout(() => {
      setAdvancing(false);
      setJustAdvanced(true);
      setTimeout(() => setJustAdvanced(false), 2500);
    }, 400);
  }, [complaint]);

  if (!complaint) return null;

  const currentIdx = STATUS_FLOW.indexOf(complaint.status as Status);
  const isResolved = complaint.status === "resuelta" || complaint.status === "cerrada";
  const nextLabel = STATUS_NEXT_LABEL[complaint.status as Status];

  return (
    <AdminLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <Link href="/admin" className="flex items-center gap-2 text-gray-500 hover:text-crimson-600 text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver a bandeja
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">

            {/* Complaint card */}
            <div className="bg-white border border-gray-200 p-6">
              <span className="block w-8 h-0.5 bg-crimson-600 mb-5" />
              <div className="flex items-start justify-between mb-4">
                <span className="font-mono text-sm text-gray-400">{complaint.folio}</span>
                <span className={`text-xs px-2 py-1 border font-medium ${URGENCY_COLORS[complaint.urgency]}`}>
                  {URGENCY_LABELS[complaint.urgency]}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1">{CATEGORY_LABELS[complaint.category]}</span>
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1">{ROLE_LABELS[complaint.role]}</span>
                <span className={`text-xs px-2 py-1 border font-medium ${STATUS_COLORS[complaint.status]}`}>
                  {STATUS_LABELS[complaint.status]}
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed text-sm">{complaint.content}</p>
              <p className="text-xs text-gray-400 mt-4">
                Recibido el {new Date(complaint.createdAt).toLocaleString("es-MX")}
              </p>
            </div>

            {/* Status manager */}
            <div className="bg-white border border-gray-200 p-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Progreso del caso</p>

              {/* Status steps */}
              <div className="flex items-center gap-0 mb-5 overflow-x-auto pb-1">
                {STATUS_FLOW.map((s, i) => {
                  const done = i <= currentIdx;
                  const current = i === currentIdx;
                  return (
                    <div key={s} className="flex items-center shrink-0">
                      <div className="flex flex-col items-center">
                        <div className={`w-7 h-7 flex items-center justify-center text-xs font-bold transition-all ${
                          done ? "bg-crimson-600 text-white" : "bg-gray-100 text-gray-400"
                        } ${current ? "ring-2 ring-crimson-200 ring-offset-1" : ""}`}>
                          {done && !current ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                        </div>
                        <span className={`text-[10px] mt-1 font-medium whitespace-nowrap ${
                          current ? "text-crimson-600" : done ? "text-gray-500" : "text-gray-300"
                        }`}>
                          {STATUS_LABELS[s]}
                        </span>
                      </div>
                      {i < STATUS_FLOW.length - 1 && (
                        <div className={`h-0.5 w-8 sm:w-12 mx-1 mb-4 transition-all ${i < currentIdx ? "bg-crimson-600" : "bg-gray-200"}`} />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Advance button */}
              {!isResolved && nextLabel && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={advanceStatus}
                    disabled={advancing}
                    className="flex items-center gap-2 bg-crimson-600 hover:bg-crimson-700 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2.5 transition-colors"
                  >
                    {advancing ? "Actualizando..." : nextLabel}
                    {!advancing && <ChevronRight className="w-4 h-4" />}
                  </button>

                  <AnimatePresence>
                    {justAdvanced && (
                      <motion.div
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-1.5 text-green-600 text-sm font-medium"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Estado actualizado
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {isResolved && (
                <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  Caso {STATUS_LABELS[complaint.status].toLowerCase()}
                </div>
              )}
            </div>

          </div>

          <div className="lg:col-span-1">
            <AIPanel complaint={complaint} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
