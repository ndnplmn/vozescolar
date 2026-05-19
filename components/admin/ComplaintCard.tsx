"use client";
import { Complaint } from "@/lib/types";
import { CATEGORY_LABELS, URGENCY_LABELS, ROLE_LABELS, STATUS_LABELS } from "@/lib/utils";
import { EyeOff, Paperclip, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const URGENCY_LEFT: Record<string, string> = {
  critical: "bg-red-500",
  high:     "bg-orange-400",
  medium:   "bg-yellow-400",
  low:      "bg-green-400",
};

const URGENCY_BADGE: Record<string, string> = {
  critical: "bg-red-50 text-red-700 border-red-200",
  high:     "bg-orange-50 text-orange-700 border-orange-200",
  medium:   "bg-yellow-50 text-yellow-700 border-yellow-200",
  low:      "bg-green-50 text-green-700 border-green-200",
};

const STATUS_BADGE: Record<string, string> = {
  recibida:    "bg-gray-100 text-gray-500",
  en_revision: "bg-blue-50 text-blue-600",
  en_proceso:  "bg-amber-50 text-amber-600",
  resuelta:    "bg-green-50 text-green-600",
  cerrada:     "bg-gray-100 text-gray-400",
};

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "ahora";
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`;
  if (diff < 604800) return `hace ${Math.floor(diff / 86400)} d`;
  return new Date(iso).toLocaleDateString("es-MX", { month: "short", day: "numeric" });
}

export function ComplaintCard({ complaint, index }: { complaint: Complaint; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.035, duration: 0.25 }}
    >
      <Link href={`/admin/queja/${complaint.id}`} className="block group">
        <div className="bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 flex overflow-hidden">

          {/* Urgency accent bar */}
          <div className={`w-1 shrink-0 ${URGENCY_LEFT[complaint.urgency]}`} />

          {/* Content */}
          <div className="flex-1 px-5 py-4 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-mono text-[11px] text-gray-400 shrink-0">{complaint.folio}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 border rounded-full shrink-0 ${URGENCY_BADGE[complaint.urgency]}`}>
                  {URGENCY_LABELS[complaint.urgency].toUpperCase()}
                </span>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${STATUS_BADGE[complaint.status]}`}>
                  {STATUS_LABELS[complaint.status]}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-gray-400 shrink-0">
                <Clock className="w-3 h-3" />
                {timeAgo(complaint.createdAt)}
              </div>
            </div>

            <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed mb-3">
              {complaint.content}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] bg-gray-100 text-gray-500 px-2 py-0.5 font-medium">
                  {CATEGORY_LABELS[complaint.category]}
                </span>
                <span className="text-[11px] bg-gray-100 text-gray-500 px-2 py-0.5 font-medium">
                  {ROLE_LABELS[complaint.role]}
                </span>
                {complaint.isAnonymous && (
                  <span className="text-[11px] text-gray-400 flex items-center gap-1">
                    <EyeOff className="w-3 h-3" /> Anónimo
                  </span>
                )}
                {complaint.evidenceName && (
                  <span className="text-[11px] text-gray-400 flex items-center gap-1">
                    <Paperclip className="w-3 h-3" /> Evidencia
                  </span>
                )}
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-crimson-400 transition-colors shrink-0" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
