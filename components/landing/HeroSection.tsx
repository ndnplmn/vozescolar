"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck, MessageSquareHeart,
  Search, ChevronDown, Menu, X, ArrowRight,
} from "lucide-react";
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";

const HOW_IT_WORKS = [
  {
    n: "01",
    icon: MessageSquareHeart,
    title: "Describe lo que ocurrió",
    desc: "Un asistente de IA te guía con preguntas simples. No necesitas redactar formalmente. El proceso toma menos de 5 minutos.",
  },
  {
    n: "02",
    icon: ShieldCheck,
    title: "Enviamos tu reporte de forma anónima",
    desc: "Tu identidad permanece oculta. No registramos nombre, IP ni ningún dato personal. Reporta con total tranquilidad.",
  },
  {
    n: "03",
    icon: Search,
    title: "Monitorea con tu número de folio",
    desc: "Al enviar recibirás un folio único. Úsalo para consultar el estado y leer la respuesta oficial del CETIS 52.",
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
  {
    q: "¿Me pueden meter en problemas por reportar?",
    a: "No. Este sistema existe precisamente para protegerte. Tu reporte es anónimo por defecto — nadie sabrá quién lo envió, ni la persona reportada ni ningún maestro. La dirección del CETIS 52 está obligada a proteger al denunciante.",
  },
  {
    q: "¿Qué pasa si lo que reporto parece insignificante?",
    a: "No existe un reporte 'sin importancia'. Si algo te incomoda, preocupa o afecta tu bienestar o el de otra persona, merece atención. El equipo está aquí para escucharte, no para juzgar.",
  },
];

const STATS = [
  { value: "100%", label: "Confidencial", sub: "Sin datos personales" },
  { value: "< 5 min", label: "Para reportar", sub: "Guiado por inteligencia artificial" },
  { value: "48 h", label: "Primera revisión", sub: "Respuesta garantizada" },
];

export function HeroSection() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <OnboardingModal />

      <div className="bg-white flex flex-col">

        {/* ── HEADER ── */}
        <header className="border-b border-crimson-200 sticky top-0 bg-white z-40">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <Image src="/cetis52-logo.svg" alt="CETIS 52 Hermenegildo Galeana" width={40} height={40} />
              <div>
                <p className="text-[10px] font-bold tracking-[0.18em] text-crimson-600 uppercase leading-none mb-0.5">CETIS 52</p>
                <p className="text-xs font-medium text-gray-700 leading-none">Hermenegildo Galeana</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-7">
              <a href="#como-funciona" className="text-sm text-gray-500 hover:text-crimson-600 transition-colors">Cómo funciona</a>
              <Link href="/seguimiento" className="text-sm text-gray-500 hover:text-crimson-600 transition-colors">Consultar folio</Link>
              <Link href="/nueva-queja">
                <Button size="sm" className="bg-crimson-600 hover:bg-crimson-700 rounded-none text-xs px-5 h-8 tracking-wide font-semibold">
                  Hacer un reporte
                </Button>
              </Link>
            </nav>

            <button className="md:hidden text-gray-500 hover:text-crimson-600 transition-colors" onClick={() => setMobileOpen(v => !v)} aria-label="Menú">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          <AnimatePresence>
            {mobileOpen && (
              <motion.nav
                initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                className="md:hidden overflow-hidden border-t border-crimson-100"
              >
                <div className="px-6 py-5 flex flex-col gap-4 bg-white">
                  <a href="#como-funciona" onClick={() => setMobileOpen(false)} className="text-sm text-gray-700">Cómo funciona</a>
                  <Link href="/seguimiento" onClick={() => setMobileOpen(false)} className="text-sm text-gray-700">Consultar folio</Link>
                  <Link href="/nueva-queja" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full bg-crimson-600 hover:bg-crimson-700 rounded-none text-sm">Hacer un reporte</Button>
                  </Link>
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </header>

        {/* ── HERO ── */}
        <section className="min-h-[calc(100vh-64px)] flex items-center border-b border-crimson-100 relative overflow-hidden">

          {/* Ghost watermark — architectural background element */}
          <div className="absolute right-0 top-0 bottom-0 flex items-center pointer-events-none select-none hidden lg:flex" aria-hidden>
            <Image
              src="/cetis52-logo.svg"
              alt=""
              width={520}
              height={520}
              className="object-contain opacity-[0.04]"
            />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-6 w-full py-20 grid grid-cols-1 lg:grid-cols-5 gap-16 items-center">

            {/* LEFT — commanding copy */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-3"
            >
              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-8">
                <span className="block w-8 h-px bg-crimson-600" />
                <span className="text-[11px] font-bold tracking-[0.2em] text-crimson-600 uppercase">
                  Canal oficial de reportes
                </span>
              </div>

              {/* H1 */}
              <h1 className="font-serif font-bold text-gray-900 leading-[1.05] mb-7" style={{ fontSize: "clamp(2.8rem, 5.5vw, 4.5rem)" }}>
                Reporta sin miedo.<br />
                Tu identidad,{" "}
                <span className="text-crimson-600 italic">siempre</span><br />
                protegida.
              </h1>

              {/* Sub */}
              <p className="text-gray-500 leading-relaxed mb-10 max-w-lg" style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)" }}>
                El buzón oficial del CETIS 52 para reportar situaciones que
                afectan a la comunidad escolar. Confidencial, seguro y con
                seguimiento en tiempo real.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <Link href="/nueva-queja">
                  <Button
                    size="lg"
                    className="bg-crimson-600 hover:bg-crimson-700 text-white font-semibold rounded-none px-10 h-12 text-sm tracking-wide gap-2 group"
                  >
                    Hacer un reporte
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </Link>
                <Link href="/seguimiento">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-gray-300 text-gray-600 hover:border-crimson-400 hover:text-crimson-600 rounded-none px-10 h-12 text-sm tracking-wide"
                  >
                    Consultar folio
                  </Button>
                </Link>
              </div>

              {/* Trust micro-line */}
              <p className="text-xs text-gray-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-crimson-300" />
                Sin nombre · Sin dirección IP · Sin cookies de rastreo
              </p>
            </motion.div>

            {/* RIGHT — institutional seal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-2 hidden lg:flex justify-end"
            >
              <div className="border border-crimson-200 p-10 w-72 flex flex-col items-center text-center gap-0">
                {/* Top rule */}
                <span className="block w-8 h-px bg-crimson-600 mb-7" />

                {/* Logo — given a formal frame and purpose */}
                <Image
                  src="/cetis52-logo.svg"
                  alt="Escudo CETIS 52"
                  width={88}
                  height={88}
                  className="object-contain mb-6"
                />

                {/* Institution identity */}
                <p className="text-[11px] font-bold tracking-[0.22em] text-crimson-600 uppercase mb-1">CETIS 52</p>
                <p className="text-[11px] font-medium tracking-[0.12em] text-gray-500 uppercase mb-7">
                  Hermenegildo Galeana
                </p>

                {/* Divider */}
                <span className="block w-full h-px bg-crimson-100 mb-7" />

                {/* Official designation */}
                <p className="text-[10px] font-bold tracking-[0.25em] text-gray-400 uppercase mb-1">Buzón virtual</p>
                <p className="font-serif text-xl font-bold text-gray-800 mb-7">Oficial</p>

                {/* Divider */}
                <span className="block w-full h-px bg-crimson-100 mb-7" />

                {/* Status */}
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">Sistema activo</p>
                </div>

                {/* Bottom rule */}
                <span className="block w-8 h-px bg-crimson-600 mt-7" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── STATS STRIP ── */}
        <section className="border-b border-crimson-100">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-crimson-100">
              {STATS.map(({ value, label, sub }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="py-8 px-6 flex flex-col items-center sm:items-start gap-1"
                >
                  <p className="font-serif text-3xl font-bold text-crimson-600 leading-none">{value}</p>
                  <p className="text-sm font-semibold text-gray-800">{label}</p>
                  <p className="text-xs text-gray-400">{sub}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CÓMO FUNCIONA ── */}
        <section id="como-funciona" className="border-b border-crimson-100 py-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-14">
              <div className="flex items-center gap-3 mb-4">
                <span className="block w-8 h-px bg-crimson-600" />
                <span className="text-[11px] font-bold tracking-[0.2em] text-crimson-600 uppercase">Proceso</span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-3">Cómo funciona</h2>
              <p className="text-gray-500 text-base max-w-lg leading-relaxed">
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
                  className={`p-8 lg:p-10 ${i < 2 ? "md:border-r border-b md:border-b-0 border-crimson-200" : ""}`}
                >
                  <div className="flex items-start gap-4 mb-6">
                    <span className="font-serif text-4xl font-bold text-crimson-100 leading-none select-none">{n}</span>
                    <div className="bg-crimson-50 p-2.5 mt-1 shrink-0">
                      <Icon className="w-5 h-5 text-crimson-600" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm leading-snug">{title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <Link href="/nueva-queja">
                <Button className="bg-crimson-600 hover:bg-crimson-700 rounded-none px-10 h-11 text-sm tracking-wide gap-2 group">
                  Comenzar ahora
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="border-b border-crimson-100 py-24">
          <div className="max-w-3xl mx-auto px-6">
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <span className="block w-8 h-px bg-crimson-600" />
                <span className="text-[11px] font-bold tracking-[0.2em] text-crimson-600 uppercase">Dudas</span>
              </div>
              <h2 className="font-serif text-3xl font-bold text-gray-900">Preguntas frecuentes</h2>
            </div>
            <div className="border border-crimson-200">
              {FAQS.map(({ q, a }, i) => (
                <div key={i} className={i < FAQS.length - 1 ? "border-b border-crimson-200" : ""}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-crimson-50/50 transition-colors"
                  >
                    <span className="text-sm font-semibold text-gray-800 pr-6 leading-snug">{q}</span>
                    <ChevronDown className={`w-4 h-4 text-crimson-500 shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-6 pt-1 text-sm text-gray-500 leading-relaxed">{a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="py-8">
          <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-3">
              <Image src="/cetis52-logo.svg" alt="" width={18} height={18} className="opacity-40" />
              <span>© {new Date().getFullYear()} CETIS 52 Hermenegildo Galeana. Todos los derechos reservados.</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/seguimiento" className="hover:text-crimson-600 transition-colors">Consultar folio</Link>
              <Link href="/nueva-queja" className="hover:text-crimson-600 transition-colors">Hacer reporte</Link>
              <Link href="/admin" className="hover:text-crimson-600 transition-colors flex items-center gap-1.5 opacity-60 hover:opacity-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Portal admin
              </Link>
              <span className="text-crimson-600 font-semibold tracking-wide">VozEscolar</span>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
