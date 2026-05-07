"use client";
import { Complaint } from "@/lib/types";
import { CATEGORY_LABELS, URGENCY_LABELS, URGENCY_COLORS, ROLE_LABELS } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function ComplaintCard({ complaint, index }: { complaint: Complaint; index: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}>
      <Link href={`/admin/queja/${complaint.id}`}>
        <div className="bg-white border border-gray-200 hover:border-crimson-400 transition-colors p-4 cursor-pointer">
          <div className="flex items-start justify-between gap-2 mb-2">
            <span className="font-mono text-xs text-gray-400">{complaint.folio}</span>
            <span className={`text-xs px-2 py-0.5 border font-medium ${URGENCY_COLORS[complaint.urgency]}`}>
              {URGENCY_LABELS[complaint.urgency]}
            </span>
          </div>
          <p className="text-sm text-gray-700 line-clamp-2 mb-3">{complaint.content}</p>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <span className="bg-gray-100 px-2 py-0.5">{CATEGORY_LABELS[complaint.category]}</span>
              <span className="bg-gray-100 px-2 py-0.5">{ROLE_LABELS[complaint.role]}</span>
              <span className="flex items-center gap-1">
                {complaint.isAnonymous ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                {complaint.isAnonymous ? "Anónimo" : "Identificado"}
              </span>
            </div>
            <span>{new Date(complaint.createdAt).toLocaleDateString("es-MX")}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
