"use client";
import { useState, useCallback } from "react";
import { Complaint } from "@/lib/types";
import { STATUS_LABELS, CATEGORY_LABELS, URGENCY_LABELS, URGENCY_COLORS } from "@/lib/utils";
import { CheckCircle2, Circle, RotateCw, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_ORDER = ["recibida", "en_revision", "en_proceso", "resuelta"] as const;

const STATUS_DESCRIPTIONS: Record<string, string> = {
  recibida:    "Tu reporte fue recibido y está en espera de revisión.",
  en_revision: "El personal del CETIS 52 está revisando tu reporte.",
  en_proceso:  "Se están tomando acciones para atender la situación.",
  resuelta:    "El caso ha sido atendido. Revisa la respuesta oficial.",
};

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "hace menos de un minuto";
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`;
  return `hace ${Math.floor(diff / 86400)} d`;
}

interface Props {
  complaint: Complaint;
  onRefresh: () => Promise<void>;
}

export function ComplaintTimeline({ complaint, onRefresh }: Props) {
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date().toISOString());

  const currentIdx = STATUS_ORDER.indexOf(complaint.status as typeof STATUS_ORDER[number]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await onRefresh();
    setLastRefresh(new Date().toISOString());
    setRefreshing(false);
  }, [onRefresh]);

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="border border-crimson-200 p-5 space-y-2">
        <span className="block w-8 h-0.5 bg-crimson-600 mb-3" />
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 font-mono">Folio: {complaint.folio}</span>
          <span className={`text-xs px-2 py-0.5 border font-medium ${URGENCY_COLORS[complaint.urgency]}`}>
            {URGENCY_LABELS[complaint.urgency]}
          </span>
        </div>
        <p className="font-semibold text-gray-800 text-sm">{CATEGORY_LABELS[complaint.category]}</p>
        <p className="text-xs text-gray-500">
          {new Date(complaint.createdAt).toLocaleDateString("es-MX", {
            year: "numeric", month: "long", day: "numeric",
          })}
        </p>

        {/* Refresh row */}
        <div className="flex items-center justify-between pt-2 border-t border-crimson-100 mt-2">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <Clock className="w-3 h-3" />
            <span>Actualizado {timeAgo(lastRefresh)}</span>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 text-[11px] text-crimson-600 hover:text-crimson-700 font-medium transition-colors disabled:opacity-50 border border-crimson-200 hover:border-crimson-300 bg-white hover:bg-crimson-50 px-2.5 py-1"
          >
            <RotateCw className={`w-3 h-3 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Actualizando..." : "Actualizar"}
          </button>
        </div>
      </div>

      {/* Timeline */}
      <AnimatePresence mode="wait">
        <motion.div
          key={complaint.status}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative"
        >
          {STATUS_ORDER.map((status, i) => {
            const timelineEntry = complaint.timeline.find((t) => t.status === status);
            const isDone = i <= currentIdx;
            const isCurrent = i === currentIdx;
            return (
              <div key={status} className="flex gap-4 mb-6">
                <div className="flex flex-col items-center">
                  <div className={isDone ? "text-crimson-600" : "text-gray-200"}>
                    {isDone ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                  </div>
                  {i < STATUS_ORDER.length - 1 && (
                    <div className={`w-0.5 h-10 mt-1 transition-colors ${isDone && i < currentIdx ? "bg-crimson-400" : "bg-gray-200"}`} />
                  )}
                </div>
                <div className="pt-0.5 pb-4 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className={`text-sm font-semibold ${isCurrent ? "text-crimson-600" : isDone ? "text-gray-700" : "text-gray-300"}`}>
                      {STATUS_LABELS[status]}
                    </p>
                    {isCurrent && (
                      <span className="text-[10px] font-bold bg-crimson-100 text-crimson-600 px-1.5 py-0.5 uppercase tracking-wide">
                        Actual
                      </span>
                    )}
                  </div>
                  {timelineEntry ? (
                    <>
                      <p className="text-xs text-gray-400 mb-1">
                        {new Date(timelineEntry.timestamp).toLocaleString("es-MX")}
                      </p>
                      {timelineEntry.message && (
                        <p className="text-sm text-gray-600 bg-crimson-50 border border-crimson-100 px-3 py-2">
                          {timelineEntry.message}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-xs text-gray-300 italic">
                      {STATUS_DESCRIPTIONS[status]}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Official response */}
      {complaint.adminResponse && (
        <div className="border border-crimson-200 bg-crimson-50 p-4">
          <p className="text-xs text-crimson-600 font-semibold tracking-wide uppercase mb-2">Respuesta oficial</p>
          <p className="text-sm text-gray-700 leading-relaxed">{complaint.adminResponse}</p>
        </div>
      )}
    </div>
  );
}
