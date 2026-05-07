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
import Image from "next/image";

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
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-crimson-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4">
            <Image src="/cetis52-logo.svg" alt="CETIS 52" width={40} height={40} className="rounded" />
            <div>
              <p className="text-[11px] font-semibold tracking-widest text-crimson-600 uppercase">CETIS 52</p>
              <p className="text-sm font-medium text-gray-800 leading-tight">Hermenegildo Galeana</p>
            </div>
          </Link>
        </div>
      </header>

      <main className="flex-1 px-4 py-12">
        <div className="max-w-lg mx-auto">
          {isNew && complaint && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-crimson-200 bg-crimson-50 p-4 mb-6 flex items-center gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-crimson-600 shrink-0" />
              <div>
                <p className="font-semibold text-crimson-700 text-sm">Reporte enviado exitosamente</p>
                <p className="text-xs text-crimson-600">Folio: <span className="font-mono font-bold">{folio}</span> — guárdalo para dar seguimiento.</p>
              </div>
            </motion.div>
          )}
          {complaint ? (
            <ComplaintTimeline complaint={complaint} />
          ) : (
            <div className="text-center py-16">
              <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-2 text-sm">No se encontró un reporte con el folio <span className="font-mono font-bold">{folio}</span></p>
              <p className="text-sm text-gray-400 mb-6">Verifica que el folio sea correcto.</p>
              <Link href="/seguimiento">
                <Button variant="outline" className="rounded-none border-crimson-200 text-crimson-600 hover:bg-crimson-50">
                  Intentar de nuevo
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-crimson-200 py-4">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-xs text-gray-400">
          <span>© {new Date().getFullYear()} CETIS 52 Hermenegildo Galeana</span>
          <span className="text-crimson-600 font-medium">VozEscolar</span>
        </div>
      </footer>
    </div>
  );
}
