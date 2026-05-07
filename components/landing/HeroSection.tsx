"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck, Clock, CheckCircle, MessageSquareHeart,
  Search, ChevronDown, Menu, X,
} from "lucide-react";
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";

const HOW_IT_WORKS = [
  {
    n: "01",
    icon: MessageSquareHeart,
    title: "Describe lo que ocurrió",
    desc: "Un asistente de IA te guía con preguntas simples. No necesitas saber redactar formalmente. El proceso toma menos de 5 minutos.",
  },
  {
    n: "02",
    icon: ShieldCheck,
    title: "Enviamos tu reporte de forma anónima",
    desc: "Tu identidad permanece oculta. No registramos tu nombre, IP ni ningún dato personal. Puedes reportar con total tranquilidad.",
  },
  {
    n: "03",
    icon: Search,
    title: "Monitorea con tu número de folio",
    desc: "Al enviar recibirás un folio único. Úsalo para consultar el estado y leer la respuesta oficial del CETIS 52 cuando esté disponible.",
  },
];

const FAQS = [
  {
    q: "¿Mi reporte es realmente anónimo?",
    a: "Sí. No almacenamos tu nombre, dirección IP ni ningún dato que permita identificarte. Puedes elegir el modo anónimo al confirmar tu reporte y nadie sabrá quién eres.",
  },
  {
    q: "¿Quién lee mis reportes?",
    a: "Solo el personal autorizado del CETIS 52 (directivos y orientadores designados). Los reportes nunca se comparten con el personal que es objeto del reporte.",
  },
  {
    q: "¿Qué pasa si pierdo mi folio?",
    a: "El folio es tu única llave de seguimiento. Te recomendamos guardarlo o copiarlo en cuanto lo recibas. Sin él, no podremos vincular tu consulta con tu reporte.",
  },
  {
    q: "¿En cuánto tiempo responden?",
    a: "Cada reporte recibe una primera revisión dentro de 48 horas hábiles. La resolución depende de la complejidad del caso, pero te mantenemos informado en cada etapa.",
  },
];

export function HeroSection() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <OnboardingModal />

      <div className="min-h-screen bg-white flex flex-col">
        {/* Top bar */}
        <header className="border-b border-crimson-200 sticky top-0 bg-white z-40">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image src="/cetis52-logo.svg" alt="CETIS 52 Hermenegildo Galeana" width={44} height={44} />
              <div>
                <p className="text-[11px] font-semibold tracking-widest text-crimson-600 uppercase">CETIS 52</p>
                <p className="text-sm font-medium text-gray-800 leading-tight">Hermenegildo Galeana</p>
              </div>
            </div>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#como-funciona" className="text-sm text-gray-600 hover:text-crimson-600 transition-colors font-medium">
                Cómo funciona
              </a>
              <Link href="/seguimiento" className="text-sm text-gray-600 hover:text-crimson-600 transition-colors font-medium">
                Consultar folio
              </Link>
              <Link href="/admin" className="text-sm text-gray-600 hover:text-crimson-600 transition-colors font-medium">
                Administración
              </Link>
              <Link href="/nueva-queja">
                <Button size="sm" className="bg-crimson-600 hover:bg-crimson-700 rounded-none text-xs px-5 h-8 tracking-wide">
                  Hacer un reporte
                </Button>
              </Link>
            </nav>

            {/* Mobile hamburger */}
            <button
              className="md:hidden text-gray-600 hover:text-crimson-600 transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menú"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile nav drawer */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.nav
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden overflow-hidden border-t border-crimson-100"
              >
                <div className="px-6 py-4 flex flex-col gap-4 bg-white">
                  <a href="#como-funciona" onClick={() => setMobileOpen(false)} className="text-sm text-gray-700 font-medium">Cómo funciona</a>
                  <Link href="/seguimiento" onClick={() => setMobileOpen(false)} className="text-sm text-gray-700 font-medium">Consultar folio</Link>
                  <Link href="/admin" onClick={() => setMobileOpen(false)} className="text-sm text-gray-700 font-medium">Administración</Link>
                  <Link href="/nueva-queja" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full bg-crimson-600 hover:bg-crimson-700 rounded-none text-sm tracking-wide">
                      Hacer un reporte
                    </Button>
                  </Link>
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </header>

        {/* ── HERO ── */}
        <section className="flex-1 flex items-center border-b border-crimson-100">
          <div className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
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
              <p className="text-lg text-gray-500 leading-relaxed mb-3 max-w-md">
                Canal seguro y confidencial para reportar situaciones que afectan el bienestar
                de la comunidad escolar del CETIS 52. Tu identidad está protegida.
              </p>
              <p className="text-xs text-gray-400 mb-10 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-crimson-400" />
                Sin nombre · Sin IP · Sin rastro
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/nueva-queja">
                  <Button size="lg" className="bg-crimson-600 hover:bg-crimson-700 text-white font-semibold px-10 py-3 rounded-none text-sm tracking-wide h-auto">
                    Hacer un reporte
                  </Button>
                </Link>
                <Link href="/seguimiento">
                  <Button size="lg" variant="outline" className="border-crimson-200 text-crimson-600 hover:bg-crimson-50 px-10 py-3 rounded-none text-sm tracking-wide h-auto">
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
              <div className="flex items-center justify-center">
                <Image src="/cetis52-logo.svg" alt="Escudo CETIS 52" width={200} height={200} className="object-contain" />
              </div>

              <div className="w-full space-y-0 border border-crimson-200">
                {[
                  { icon: ShieldCheck, label: "100% Confidencial", desc: "Tu identidad nunca es revelada" },
                  { icon: Clock, label: "Seguimiento en tiempo real", desc: "Monitorea el estado de tu reporte" },
                  { icon: CheckCircle, label: "Atención garantizada", desc: "Cada reporte recibe una respuesta" },
                ].map(({ icon: Icon, label, desc }, i) => (
                  <div key={label} className={`flex items-start gap-4 px-5 py-4 ${i < 2 ? "border-b border-crimson-200" : ""}`}>
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
        </section>

        {/* ── CÓMO FUNCIONA ── */}
        <section id="como-funciona" className="border-b border-crimson-100 py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-12">
              <span className="block w-8 h-0.5 bg-crimson-600 mb-4" />
              <h2 className="font-serif text-3xl font-bold text-gray-900 mb-2">Cómo funciona</h2>
              <p className="text-gray-500 text-sm max-w-lg">
                Reportar es simple, rápido y completamente anónimo. Tres pasos son todo lo que necesitas.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-crimson-200">
              {HOW_IT_WORKS.map(({ n, icon: Icon, title, desc }, i) => (
                <motion.div
                  key={n}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.5 }}
                  className={`p-8 ${i < 2 ? "md:border-r border-b md:border-b-0 border-crimson-200" : ""}`}
                >
                  <div className="flex items-start gap-4 mb-5">
                    <span className="font-serif text-3xl font-bold text-crimson-100 leading-none">{n}</span>
                    <div className="bg-crimson-50 p-2.5 mt-0.5">
                      <Icon className="w-5 h-5 text-crimson-600" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">{title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link href="/nueva-queja">
                <Button className="bg-crimson-600 hover:bg-crimson-700 rounded-none px-10 text-sm tracking-wide">
                  Comenzar ahora
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="border-b border-crimson-100 py-20">
          <div className="max-w-3xl mx-auto px-6">
            <div className="mb-10">
              <span className="block w-8 h-0.5 bg-crimson-600 mb-4" />
              <h2 className="font-serif text-2xl font-bold text-gray-900">Preguntas frecuentes</h2>
            </div>
            <div className="space-y-0 border border-crimson-200">
              {FAQS.map(({ q, a }, i) => (
                <div key={i} className={i < FAQS.length - 1 ? "border-b border-crimson-200" : ""}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-crimson-50 transition-colors"
                  >
                    <span className="text-sm font-medium text-gray-800 pr-4">{q}</span>
                    <ChevronDown className={`w-4 h-4 text-crimson-600 shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-5 pt-1 text-sm text-gray-500 leading-relaxed">{a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="py-6">
          <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
            <div className="flex items-center gap-3">
              <Image src="/cetis52-logo.svg" alt="" width={20} height={20} className="opacity-50" />
              <span>© {new Date().getFullYear()} CETIS 52 Hermenegildo Galeana</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/seguimiento" className="hover:text-crimson-600 transition-colors">Consultar folio</Link>
              <Link href="/nueva-queja" className="hover:text-crimson-600 transition-colors">Hacer reporte</Link>
              <span className="text-crimson-600 font-medium">VozEscolar</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
