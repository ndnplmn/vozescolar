"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Complaint } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { ComplaintTimeline } from "@/components/tracking/ComplaintTimeline";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Copy, Check, PlusCircle, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function TrackingPage() {
  const { folio } = useParams<{ folio: string }>();
  const searchParams = useSearchParams();
  const isNew = searchParams.get("nuevo") === "true";
  const [complaint, setComplaint] = useState<Complaint | null | undefined>(undefined);
  const [copied, setCopied] = useState(false);

  const fetchComplaint = useCallback(async () => {
    const res = await fetch(`/api/complaints/${folio}`);
    if (!res.ok) { setComplaint(null); return; }
    const data = await res.json();
    setComplaint(data.complaint);
  }, [folio]);

  useEffect(() => {
    fetchComplaint();

    // Realtime: re-fetch on any change to this complaint row
    const channel = supabase
      .channel(`complaint-${folio}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "complaints", filter: `folio=eq.${folio}` },
        () => fetchComplaint()
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "timeline_entries" },
        () => fetchComplaint()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [folio, fetchComplaint]);

  function copyFolio() {
    navigator.clipboard.writeText(folio).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

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
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-xs text-gray-500 hover:text-crimson-600 transition-colors flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5" /> Inicio
            </Link>
            <Link href="/nueva-queja">
              <Button size="sm" className="bg-crimson-600 hover:bg-crimson-700 rounded-none text-xs px-4 h-8">
                Nuevo reporte
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 px-4 py-12">
        <div className="max-w-lg mx-auto">
          {isNew && complaint && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-green-200 bg-green-50 p-5 mb-6"
            >
              <div className="flex items-start gap-3 mb-4">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-800 text-sm">Reporte enviado exitosamente</p>
                  <p className="text-xs text-green-700 mt-0.5">Tu queja ha sido registrada. Guarda tu folio para dar seguimiento.</p>
                </div>
              </div>

              <div className="bg-white border border-green-200 px-4 py-3 flex items-center justify-between mb-4">
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-0.5">Tu folio</p>
                  <p className="font-mono font-bold text-gray-900 text-lg tracking-wider">{folio}</p>
                </div>
                <button
                  onClick={copyFolio}
                  className="flex items-center gap-1.5 text-xs text-green-700 hover:text-green-900 transition-colors border border-green-200 px-3 py-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copiado" : "Copiar"}
                </button>
              </div>

              <div className="flex gap-3">
                <Link href="/nueva-queja" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full rounded-none border-green-300 text-green-800 hover:bg-green-100 text-xs h-9 gap-1.5"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    Hacer otro reporte
                  </Button>
                </Link>
                <Link href="/" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full rounded-none border-green-300 text-green-800 hover:bg-green-100 text-xs h-9 gap-1.5"
                  >
                    <Home className="w-3.5 h-3.5" />
                    Ir al inicio
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}

          {complaint ? (
            <ComplaintTimeline complaint={complaint} onRefresh={fetchComplaint} />
          ) : (
            <div className="text-center py-16">
              <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-2 text-sm">No se encontró un reporte con el folio <span className="font-mono font-bold">{folio}</span></p>
              <p className="text-sm text-gray-400 mb-6">Verifica que el folio sea correcto.</p>
              <div className="flex gap-3 justify-center">
                <Link href="/seguimiento">
                  <Button variant="outline" className="rounded-none border-crimson-200 text-crimson-600 hover:bg-crimson-50">
                    Intentar de nuevo
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="rounded-none border-gray-200 text-gray-600 hover:bg-gray-50">
                    Ir al inicio
                  </Button>
                </Link>
              </div>
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
