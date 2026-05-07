"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Clock, CheckCircle } from "lucide-react";

export function HeroSection() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top bar */}
      <header className="border-b border-crimson-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/cetis52-logo.svg"
              alt="CETIS 52 Hermenegildo Galeana"
              width={48}
              height={48}
              className="rounded"
            />
            <div>
              <p className="text-[11px] font-semibold tracking-widest text-crimson-600 uppercase">
                CETIS 52
              </p>
              <p className="text-sm font-medium text-gray-800 leading-tight">
                Hermenegildo Galeana
              </p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/seguimiento"
              className="text-sm text-gray-600 hover:text-crimson-600 transition-colors font-medium"
            >
              Consultar folio
            </Link>
            <Link
              href="/admin"
              className="text-sm text-gray-600 hover:text-crimson-600 transition-colors font-medium"
            >
              Administración
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center">
        <div className="max-w-6xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="block w-12 h-0.5 bg-crimson-600 mb-8" />
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-gray-900 leading-[1.1] mb-6">
              Tu voz<br />
              <span className="text-crimson-600">transforma</span><br />
              la escuela.
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed mb-10 max-w-md">
              Canal seguro y confidencial para reportar situaciones que
              afectan el bienestar de la comunidad escolar del CETIS 52.
              Tu identidad está protegida.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/nueva-queja">
                <Button
                  size="lg"
                  className="bg-crimson-600 hover:bg-crimson-700 text-white font-semibold px-10 py-3 rounded-none text-sm tracking-wide h-auto"
                >
                  Hacer un reporte
                </Button>
              </Link>
              <Link href="/seguimiento">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-crimson-200 text-crimson-600 hover:bg-crimson-50 px-10 py-3 rounded-none text-sm tracking-wide h-auto"
                >
                  Consultar folio
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right — logo + guarantees */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="flex flex-col items-center lg:items-end gap-8"
          >
            <div className="bg-crimson-50 border border-crimson-200 p-10 flex items-center justify-center">
              <Image
                src="/cetis52-logo.svg"
                alt="Escudo CETIS 52"
                width={180}
                height={180}
                className="object-contain"
              />
            </div>

            <div className="w-full space-y-0 border border-crimson-200">
              {[
                { icon: ShieldCheck, label: "100% Confidencial", desc: "Tu identidad nunca es revelada" },
                { icon: Clock,       label: "Seguimiento en tiempo real", desc: "Monitorea el estado de tu reporte" },
                { icon: CheckCircle, label: "Atención garantizada", desc: "Cada reporte recibe una respuesta" },
              ].map(({ icon: Icon, label, desc }, i) => (
                <div
                  key={label}
                  className={`flex items-start gap-4 px-5 py-4 ${i < 2 ? "border-b border-crimson-200" : ""}`}
                >
                  <Icon className="w-4 h-4 text-crimson-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer strip */}
      <footer className="border-t border-crimson-200 py-4">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-xs text-gray-400">
          <span>© {new Date().getFullYear()} CETIS 52 Hermenegildo Galeana</span>
          <span className="text-crimson-600 font-medium">VozEscolar</span>
        </div>
      </footer>
    </div>
  );
}
