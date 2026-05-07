"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShieldCheck, MessageSquareHeart, Eye } from "lucide-react";
import { getSchoolConfig } from "@/lib/config";

export function HeroSection() {
  const config = getSchoolConfig();

  return (
    <section className="min-h-screen bg-gradient-to-br from-navy-600 via-navy-700 to-navy-800 flex flex-col items-center justify-center px-4 py-16 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl"
      >
        <div className="flex items-center justify-center mb-6">
          <div className="bg-teal-600 rounded-2xl p-4">
            <MessageSquareHeart className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          Tu voz importa en<br />
          <span className="text-teal-400">{config.name}</span>
        </h1>
        <p className="text-lg text-navy-100 mb-8 leading-relaxed">
          Este es un espacio seguro y confidencial para reportar situaciones
          que afectan tu bienestar escolar. Tu identidad está protegida.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/nueva-queja">
            <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-4 rounded-xl text-base w-full sm:w-auto">
              Hacer un reporte
            </Button>
          </Link>
          <Link href="/seguimiento">
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-xl text-base w-full sm:w-auto">
              Consultar mi folio
            </Button>
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-3 gap-6 text-center">
          {[
            { icon: ShieldCheck, label: "100% Confidencial" },
            { icon: Eye, label: "Seguimiento en tiempo real" },
            { icon: MessageSquareHeart, label: "Atención garantizada" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <Icon className="w-6 h-6 text-teal-400" />
              <span className="text-xs text-navy-100">{label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
