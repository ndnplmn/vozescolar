"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Complaint } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { ComplaintTimeline } from "@/components/tracking/ComplaintTimeline";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Copy, Check, PlusCircle, Home, Wifi, WifiOff } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function TrackingPage() {
  const { folio } = useParams<{ folio: string }>();
  const searchParams = useSearchParams();
  const isNew = searchParams.get("nuevo") === "true";
  const [complaint, setComplaint]           = useState<Complaint | null | undefined>(undefined);
  const [copied, setCopied]                 = useState(false);
  const [realtimeStatus, setRealtimeStatus] = useState<"connecting" | "connected" | "disconnected">("connecting");

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
      .subscribe((status) => {
        if (status === "SUBSCRIBED")     setRealtimeStatus("connected");
        else if (status === "CLOSED")    setRealtimeStatus("disconnected");
        else if (status === "CHANNEL_ERROR") setRealtimeStatus("disconnected");
      });

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
          <nav className="flex items-center gap-3">
            {/* Realtime connection indicator */}
            <div className="hidden sm:flex items-center gap-1.5 text-[11px]">
              {realtimeStatus === "connected" && (
                <><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /><span className="text-gray-400">En vivo</span></>
              )}
              {realtimeStatus === "connecting" && (
                <><span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" /><span className="text-gray-400">Conectando...</span></>
              )}
              {realtimeStatus === "disconnected" && (
                <><WifiOff className="w-3 h-3 text-red-400" /><span className="text-red-500 font-medium">Sin conexión — datos podrían estar desactualizados</span></>
              )}
            </div>
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
                  <p className="font-semibold text-green-800 text-sm">Tu reporte llegó correctamente</p>
                  <p className="text-xs text-green-700 mt-0.5 leading-relaxed">Gracias por reportarlo. El equipo del CETIS 52 lo revisará en las próximas 48 horas. Guarda tu folio — es la única forma de consultar el estado.</p>
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

          {/* Offline banner for mobile (full-width) */}
          {realtimeStatus === "disconnected" && complaint && (
            <div className="sm:hidden flex items-center gap-2 bg-red-50 border border-red-200 px-4 py-2.5 mb-4 text-xs text-red-600">
              <WifiOff className="w-3.5 h-3.5 shrink-0" />
              <span>Sin conexión en vivo — los datos podrían no estar actualizados.</span>
            </div>
          )}

          {complaint ? (
            <ComplaintTimeline complaint={complaint} onRefresh={fetchComplaint} />
          ) : (
            <div className="border border-gray-200 p-8 text-center">
              <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-4" />
              <p className="font-semibold text-gray-700 text-sm mb-1">No encontramos este folio</p>
              <p className="font-mono text-xs text-gray-400 mb-4">{folio}</p>
              <div className="text-left bg-gray-50 border border-gray-200 px-4 py-3 mb-6 space-y-1.5">
                <p className="text-xs text-gray-600 font-medium">Posibles causas:</p>
                <p className="text-xs text-gray-500">• Verifica que copiaste el folio completo y sin espacios</p>
                <p className="text-xs text-gray-500">• El formato es <span className="font-mono">VE-2026-A1B2C3</span></p>
                <p className="text-xs text-gray-500">• Si crees que es un error, contacta a la escuela</p>
                <p className="text-xs text-gray-400 mt-2 italic">Si ya enviaste un reporte, este error no lo afecta — sigue registrado.</p>
              </div>
              <div className="flex gap-3 justify-center">
                <Link href="/seguimiento">
                  <Button variant="outline" className="rounded-none border-crimson-200 text-crimson-600 hover:bg-crimson-50 text-sm">
                    Buscar otro folio
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="rounded-none border-gray-200 text-gray-600 hover:bg-gray-50 text-sm">
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
