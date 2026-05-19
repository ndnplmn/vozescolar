"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { Complaint, Status } from "@/lib/types";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AIPanel } from "@/components/admin/AIPanel";
import { CATEGORY_LABELS, URGENCY_LABELS, URGENCY_COLORS, STATUS_LABELS, ROLE_LABELS } from "@/lib/utils";
import { ArrowLeft, CheckCircle2, ChevronRight, Paperclip, EyeOff, Calendar, Tag } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_FLOW: Status[] = ["recibida", "en_revision", "en_proceso", "resuelta"];
const STATUS_NEXT_LABEL: Partial<Record<Status, string>> = {
  recibida:    "Marcar como En revisión",
  en_revision: "Marcar como En proceso",
  en_proceso:  "Marcar como Resuelta",
};
const STATUS_COLORS: Record<Status, { bg: string; text: string; border: string }> = {
  recibida:    { bg: "bg-gray-100",    text: "text-gray-600",    border: "border-gray-200" },
  en_revision: { bg: "bg-blue-50",     text: "text-blue-700",    border: "border-blue-200" },
  en_proceso:  { bg: "bg-amber-50",    text: "text-amber-700",   border: "border-amber-200" },
  resuelta:    { bg: "bg-green-50",    text: "text-green-700",   border: "border-green-200" },
  cerrada:     { bg: "bg-gray-100",    text: "text-gray-400",    border: "border-gray-200" },
};
const URGENCY_LEFT: Record<string, string> = {
  critical: "bg-red-500",
  high:     "bg-orange-400",
  medium:   "bg-yellow-400",
  low:      "bg-green-400",
};

export default function ComplaintDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [advancing, setAdvancing] = useState(false);
  const [justAdvanced, setJustAdvanced] = useState(false);

  useEffect(() => {
    fetch(`/api/complaints/${id}`)
      .then(r => r.json())
      .then(d => setComplaint(d.complaint ?? null));
  }, [id]);

  const advanceStatus = useCallback(async () => {
    if (!complaint) return;
    const idx = STATUS_FLOW.indexOf(complaint.status as Status);
    if (idx < 0 || idx >= STATUS_FLOW.length - 1) return;
    setAdvancing(true);
    const nextStatus = STATUS_FLOW[idx + 1];
    const res = await fetch(`/api/complaints/${complaint.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    if (res.ok) {
      setComplaint(prev => prev ? { ...prev, status: nextStatus } : null);
      setJustAdvanced(true);
      setTimeout(() => setJustAdvanced(false), 3000);
    }
    setAdvancing(false);
  }, [complaint]);

  if (!complaint) return (
    <AdminLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="space-y-4">
          <div className="h-8 w-32 bg-gray-200 animate-pulse" />
          <div className="h-48 bg-gray-200 animate-pulse" />
          <div className="h-32 bg-gray-200 animate-pulse" />
        </div>
      </div>
    </AdminLayout>
  );

  const currentIdx = STATUS_FLOW.indexOf(complaint.status as Status);
  const isResolved = complaint.status === "resuelta" || complaint.status === "cerrada";
  const nextLabel = STATUS_NEXT_LABEL[complaint.status as Status];
  const statusStyle = STATUS_COLORS[complaint.status] ?? STATUS_COLORS.cerrada;

  return (
    <AdminLayout>
      <div className="p-6 max-w-5xl mx-auto">

        {/* Back */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-crimson-600 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Volver a la bandeja
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ── Left column ── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Complaint card */}
            <div className="bg-white border border-gray-200 overflow-hidden">
              <div className="flex">
                {/* Urgency bar */}
                <div className={`w-1.5 shrink-0 ${URGENCY_LEFT[complaint.urgency]}`} />
                <div className="flex-1 p-6">
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                      <p className="font-mono text-xs text-gray-400 mb-1.5">{complaint.folio}</p>
                      <h2 className="font-serif text-lg font-bold text-gray-900">
                        {CATEGORY_LABELS[complaint.category]}
                      </h2>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1.5 border rounded-full shrink-0 ${URGENCY_COLORS[complaint.urgency]}`}>
                      {URGENCY_LABELS[complaint.urgency]}
                    </span>
                  </div>

                  {/* Meta chips */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    <span className={`inline-flex items-center text-xs font-semibold px-3 py-1 border rounded-full ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                      {STATUS_LABELS[complaint.status]}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                      <Tag className="w-3 h-3" />
                      {ROLE_LABELS[complaint.role]}
                    </span>
                    {complaint.isAnonymous && (
                      <span className="inline-flex items-center gap-1.5 text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                        <EyeOff className="w-3 h-3" />
                        Anónimo
                      </span>
                    )}
                    {complaint.evidenceName && (
                      <span className="inline-flex items-center gap-1.5 text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100">
                        <Paperclip className="w-3 h-3" />
                        {complaint.evidenceName}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="bg-gray-50 border border-gray-100 p-4 mb-4">
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{complaint.content}</p>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Calendar className="w-3.5 h-3.5" />
                    Recibido el {new Date(complaint.createdAt).toLocaleString("es-MX", { dateStyle: "long", timeStyle: "short" })}
                  </div>
                </div>
              </div>
            </div>

            {/* Status workflow */}
            <div className="bg-white border border-gray-200 p-6">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-5">Flujo del caso</p>

              {/* Stepper */}
              <div className="flex items-start gap-0 mb-6 overflow-x-auto pb-1">
                {STATUS_FLOW.map((s, i) => {
                  const done = i <= currentIdx;
                  const current = i === currentIdx;
                  return (
                    <div key={s} className="flex items-center shrink-0">
                      <div className="flex flex-col items-center">
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
                          ${done ? "bg-crimson-600 text-white shadow-md shadow-crimson-200" : "bg-gray-100 text-gray-400"}
                          ${current ? "ring-4 ring-crimson-100" : ""}
                        `}>
                          {done && !current ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                        </div>
                        <p className={`text-[10px] mt-1.5 font-semibold text-center max-w-[64px] leading-snug ${
                          current ? "text-crimson-600" : done ? "text-gray-600" : "text-gray-300"
                        }`}>
                          {STATUS_LABELS[s]}
                        </p>
                      </div>
                      {i < STATUS_FLOW.length - 1 && (
                        <div className={`h-0.5 w-10 sm:w-16 mx-1 mb-5 flex-shrink-0 transition-colors ${
                          i < currentIdx ? "bg-crimson-400" : "bg-gray-200"
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Advance button */}
              {!isResolved && nextLabel && (
                <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                  <button
                    onClick={advanceStatus}
                    disabled={advancing}
                    className="flex items-center gap-2 bg-crimson-600 hover:bg-crimson-700 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2.5 transition-colors shadow-sm"
                  >
                    {advancing ? (
                      <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        Actualizando...
                      </>
                    ) : (
                      <>{nextLabel}<ChevronRight className="w-4 h-4" /></>
                    )}
                  </button>

                  <AnimatePresence>
                    {justAdvanced && (
                      <motion.div
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 text-green-600 text-sm font-medium"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Estado actualizado
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {isResolved && (
                <div className="flex items-center gap-2 text-green-600 text-sm font-semibold pt-2 border-t border-gray-100">
                  <CheckCircle2 className="w-4 h-4" />
                  Caso {STATUS_LABELS[complaint.status].toLowerCase()}
                </div>
              )}
            </div>

            {/* Timeline */}
            {complaint.timeline && complaint.timeline.length > 0 && (
              <div className="bg-white border border-gray-200 p-6">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">Historial del caso</p>
                <div className="space-y-3">
                  {[...complaint.timeline].reverse().map((entry, i) => {
                    const s = STATUS_COLORS[entry.status as Status] ?? STATUS_COLORS.cerrada;
                    return (
                      <div key={i} className="flex gap-3">
                        <div className="flex flex-col items-center shrink-0">
                          <div className={`w-2 h-2 rounded-full mt-1.5 ${i === 0 ? "bg-crimson-600" : "bg-gray-300"}`} />
                          {i < complaint.timeline.length - 1 && <div className="w-px flex-1 bg-gray-200 mt-1" />}
                        </div>
                        <div className="pb-3 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            <span className={`text-[10px] font-bold px-2 py-0.5 border rounded-full ${s.bg} ${s.text} ${s.border}`}>
                              {STATUS_LABELS[entry.status as Status] ?? entry.status}
                            </span>
                            <span className="text-[11px] text-gray-400">
                              {new Date(entry.timestamp).toLocaleString("es-MX", { dateStyle: "short", timeStyle: "short" })}
                            </span>
                          </div>
                          {entry.message && (
                            <p className="text-xs text-gray-600 mt-1">{entry.message}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ── Right column ── */}
          <div className="lg:col-span-1">
            <AIPanel complaint={complaint} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
