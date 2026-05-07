"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function SeguimientoPage() {
  const [folio, setFolio] = useState("");
  const router = useRouter();

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

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="border border-crimson-200 p-10">
            <span className="block w-8 h-0.5 bg-crimson-600 mb-6" />
            <div className="flex items-center gap-3 mb-4">
              <Search className="w-5 h-5 text-crimson-600" />
              <h1 className="font-serif text-2xl font-bold text-gray-900">Consultar reporte</h1>
            </div>
            <p className="text-sm text-gray-500 mb-8">Ingresa tu número de folio para ver el estado de tu reporte.</p>
            <Input
              value={folio}
              onChange={(e) => setFolio(e.target.value.toUpperCase())}
              placeholder="VE-2026-XXXX"
              className="text-center font-mono text-lg mb-4 rounded-none border-crimson-200 focus:border-crimson-600"
              onKeyDown={(e) => { if (e.key === "Enter" && folio) router.push(`/seguimiento/${folio}`); }}
            />
            <Button
              onClick={() => folio && router.push(`/seguimiento/${folio}`)}
              disabled={!folio}
              className="w-full bg-crimson-600 hover:bg-crimson-700 rounded-none tracking-wide"
            >
              Consultar
            </Button>
          </div>
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
