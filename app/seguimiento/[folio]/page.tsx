"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { getComplaintByFolio } from "@/lib/storage";
import { Complaint } from "@/lib/types";
import { ComplaintTimeline } from "@/components/tracking/ComplaintTimeline";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TrackingPage() {
  const { folio } = useParams<{ folio: string }>();
  const searchParams = useSearchParams();
  const isNew = searchParams.get("nuevo") === "true";
  const [complaint, setComplaint] = useState<Complaint | null | undefined>(undefined);

  useEffect(() => {
    setComplaint(getComplaintByFolio(folio));
  }, [folio]);

  if (complaint === undefined) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-50 to-white px-4 py-8">
      <div className="max-w-lg mx-auto">
        {isNew && complaint && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-6 flex items-center gap-3"
          >
            <CheckCircle2 className="w-6 h-6 text-teal-600 shrink-0" />
            <div>
              <p className="font-semibold text-teal-700">¡Reporte enviado!</p>
              <p className="text-sm text-teal-600">Folio: <span className="font-mono font-bold">{folio}</span> — guárdalo para dar seguimiento.</p>
            </div>
          </motion.div>
        )}
        {complaint ? (
          <ComplaintTimeline complaint={complaint} />
        ) : (
          <div className="text-center py-16">
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No se encontró un reporte con el folio <span className="font-mono font-bold">{folio}</span></p>
            <p className="text-sm text-gray-400 mb-6">Verifica que el folio sea correcto.</p>
            <Link href="/seguimiento"><Button variant="outline">Intentar de nuevo</Button></Link>
          </div>
        )}
      </div>
    </div>
  );
}
