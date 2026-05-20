"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { Complaint, Status } from "@/lib/types";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AIPanel } from "@/components/admin/AIPanel";
import { CATEGORY_LABELS, URGENCY_LABELS, URGENCY_COLORS, STATUS_LABELS, ROLE_LABELS } from "@/lib/utils";
import { ArrowLeft, CheckCircle2, ChevronRight, Paperclip, EyeOff, Calendar, Tag, Download, ZoomIn, X, XCircle, RefreshCw, AlertCircle } from "lucide-react";
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

// Evidence URL expires after 1 hour; refresh a bit before
const EVIDENCE_TTL_MS = 55 * 60 * 1000;

export default function ComplaintDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading]           = useState(true);
  const [complaint, setComplaint]       = useState<Complaint | null>(null);
  const [advancing, setAdvancing]         = useState(false);
  const [closing, setClosing]             = useState(false);
  const [justAdvanced, setJustAdvanced]   = useState(false);
  const [closeModalOpen, setCloseModalOpen] = useState(false);
  const [closeReason, setCloseReason]     = useState("");
  const [evidenceUrl, setEvidenceUrl]   = useState<string | null>(null);
  const [evidenceFetchedAt, setEvidenceFetchedAt] = useState<number | null>(null);
  const [evidenceRefreshing, setEvidenceRefreshing] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const fetchEvidence = useCallback(async (complaintId: string) => {
    const res = await fetch(`/api/admin/complaints/${complaintId}/evidence`);
    if (!res.ok) return;
    const data = await res.json();
    if (data.signedUrl) {
      setEvidenceUrl(data.signedUrl);
      setEvidenceFetchedAt(Date.now());
    }
  }, []);

  useEffect(() => {
    fetch(`/api/complaints/${id}`)
      .then(r => r.json())
      .then(d => {
        const c = d.complaint ?? null;
        setComplaint(c);
        setLoading(false);
        if (c?.evidenceName) fetchEvidence(c.id);
      })
      .catch(() => setLoading(false));
  }, [id, fetchEvidence]);

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

  const closeCase = useCallback(async (reason: string) => {
    if (!complaint) return;
    setClosing(true);
    const REASON_MESSAGES: Record<string, string> = {
      false_report: "El reporte fue revisado y determinado como no fundamentado.",
      duplicate:    "Este reporte es duplicado de uno previamente atendido.",
      no_info:      "No se pudo atender por falta de información suficiente.",
      resolved_external: "La situación fue atendida por otro canal antes de llegar a este proceso.",
      other:        "El caso fue cerrado por el equipo administrativo.",
    };
    const message = REASON_MESSAGES[reason] ?? "El caso fue cerrado administrativamente.";
    const res = await fetch(`/api/complaints/${complaint.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "cerrada", message }),
    });
    if (res.ok) {
      setComplaint(prev => prev ? { ...prev, status: "cerrada" } : null);
      setJustAdvanced(true);
      setTimeout(() => setJustAdvanced(false), 3000);
    }
    setClosing(false);
    setCloseModalOpen(false);
    setCloseReason("");
  }, [complaint]);

  const refreshEvidence = useCallback(async () => {
    if (!complaint) return;
    setEvidenceRefreshing(true);
    await fetchEvidence(complaint.id);
    setEvidenceRefreshing(false);
  }, [complaint, fetchEvidence]);

  // Loading skeleton
  if (loading) return (
    <AdminLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-4">
        <div className="h-8 w-32 bg-gray-200 animate-pulse" />
        <div className="h-48 bg-gray-200 animate-pulse" />
        <div className="h-32 bg-gray-200 animate-pulse" />
      </div>
    </AdminLayout>
  );

  // Not found
  if (!complaint) return (
    <AdminLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-crimson-600 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Volver a la bandeja
        </Link>
        <div className="bg-white border border-gray-200 p-10 flex flex-col items-center text-center">
          <AlertCircle className="w-10 h-10 text-gray-300 mb-4" />
          <p className="text-gray-700 font-semibold mb-1">Reporte no encontrado</p>
          <p className="text-sm text-gray-400">El expediente solicitado no existe o fue eliminado.</p>
          <Link href="/admin" className="mt-5 text-sm text-crimson-600 hover:underline">
            Ir a la bandeja
          </Link>
        </div>
      </div>
    </AdminLayout>
  );

  const currentIdx = STATUS_FLOW.indexOf(complaint.status as Status);
  const isTerminal = complaint.status === "resuelta" || complaint.status === "cerrada";
  const nextLabel  = STATUS_NEXT_LABEL[complaint.status as Status];
  const statusStyle = STATUS_COLORS[complaint.status] ?? STATUS_COLORS.cerrada;
  const evidenceExpired = evidenceFetchedAt !== null && Date.now() - evidenceFetchedAt > EVIDENCE_TTL_MS;

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
                <div className={`w-1.5 shrink-0 ${URGENCY_LEFT[complaint.urgency]}`} />
                <div className="flex-1 p-6">
                  {/* Header */}
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

                  {/* Evidence viewer */}
                  {complaint.evidenceName && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                          <Paperclip className="w-3 h-3" />
                          Evidencia adjunta
                        </p>
                        {evidenceUrl && (
                          <button
                            onClick={refreshEvidence}
                            disabled={evidenceRefreshing}
                            title="Renovar enlace de evidencia"
                            className={`flex items-center gap-1 text-[11px] transition-colors disabled:opacity-50 ${
                              evidenceExpired
                                ? "text-amber-600 hover:text-amber-700 font-medium"
                                : "text-gray-400 hover:text-gray-600"
                            }`}
                          >
                            <RefreshCw className={`w-3 h-3 ${evidenceRefreshing ? "animate-spin" : ""}`} />
                            {evidenceExpired ? "Enlace expirado — renovar" : "Renovar enlace"}
                          </button>
                        )}
                      </div>
                      {!evidenceUrl ? (
                        <div className="h-10 bg-gray-100 animate-pulse rounded" />
                      ) : complaint.evidenceName.toLowerCase().endsWith(".pdf") ? (
                        <a
                          href={evidenceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-blue-50 border border-blue-200 text-blue-700 text-sm font-semibold hover:bg-blue-100 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          {complaint.evidenceName}
                          <span className="text-[10px] font-normal text-blue-400 ml-1">Abrir PDF</span>
                        </a>
                      ) : (
                        <div className="relative group w-fit">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={evidenceUrl}
                            alt={complaint.evidenceName}
                            className="max-h-48 max-w-full object-contain border border-gray-200 bg-gray-50 cursor-zoom-in"
                            onClick={() => setLightboxOpen(true)}
                          />
                          <button
                            onClick={() => setLightboxOpen(true)}
                            className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
                          >
                            <ZoomIn className="w-6 h-6 text-white drop-shadow" />
                          </button>
                          <p className="text-[11px] text-gray-400 mt-1">{complaint.evidenceName}</p>
                        </div>
                      )}
                    </div>
                  )}

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
                  const done    = i <= currentIdx;
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

              {/* Actions row */}
              {!isTerminal && (
                <div className="flex items-center gap-3 pt-2 border-t border-gray-100 flex-wrap">
                  {nextLabel && (
                    <button
                      onClick={advanceStatus}
                      disabled={advancing || closing}
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
                  )}

                  {/* Close without action */}
                  <button
                    onClick={() => setCloseModalOpen(true)}
                    disabled={advancing || closing}
                    className="flex items-center gap-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 text-sm font-medium px-3 py-2.5 border border-gray-200 hover:border-gray-300 bg-white transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />Cerrar sin acción
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

              {isTerminal && (
                <div className={`flex items-center gap-2 text-sm font-semibold pt-2 border-t border-gray-100 ${
                  complaint.status === "cerrada" ? "text-gray-400" : "text-green-600"
                }`}>
                  {complaint.status === "cerrada"
                    ? <><XCircle className="w-4 h-4" />Caso cerrado sin acción</>
                    : <><CheckCircle2 className="w-4 h-4" />Caso {STATUS_LABELS[complaint.status].toLowerCase()}</>
                  }
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

      {/* Close without action modal */}
      <AnimatePresence>
        {closeModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setCloseModalOpen(false)}
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
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Cerrar sin acción</p>
                  <p className="text-xs text-gray-500 mt-0.5">Folio: <span className="font-mono font-bold text-gray-700">{complaint.folio}</span></p>
                </div>
                <button onClick={() => setCloseModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-gray-500 mb-3">¿Cuál es el motivo del cierre? El estudiante verá una explicación basada en tu selección.</p>

              <div className="space-y-2 mb-5">
                {[
                  { value: "false_report",       label: "Reporte no fundamentado" },
                  { value: "duplicate",          label: "Duplicado de un caso ya atendido" },
                  { value: "no_info",            label: "Información insuficiente para investigar" },
                  { value: "resolved_external",  label: "Atendido por otro canal" },
                  { value: "other",              label: "Otro motivo administrativo" },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setCloseReason(value)}
                    className={`w-full text-left px-3 py-2.5 border text-sm transition-all ${
                      closeReason === value
                        ? "border-gray-700 bg-gray-50 text-gray-800 font-medium"
                        : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setCloseModalOpen(false)}
                  className="flex-1 h-10 border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => closeCase(closeReason)}
                  disabled={!closeReason || closing}
                  className="flex-1 h-10 bg-gray-700 hover:bg-gray-800 disabled:opacity-40 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  {closing ? (
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                  ) : <><XCircle className="w-3.5 h-3.5" /> Confirmar cierre</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && evidenceUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
              onClick={() => setLightboxOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={evidenceUrl}
              alt={complaint.evidenceName}
              className="max-w-full max-h-[90vh] object-contain shadow-2xl"
              onClick={e => e.stopPropagation()}
            />
            <a
              href={evidenceUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="absolute bottom-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-full transition-colors"
              onClick={e => e.stopPropagation()}
            >
              <Download className="w-4 h-4" />
              Descargar
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
