"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const FOLIO_REGEX = /^VE-\d{4}-[A-Z0-9]{6}$/;

export default function SeguimientoPage() {
  const [folio, setFolio] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  function handleChange(value: string) {
    const upper = value.toUpperCase();
    setFolio(upper);
    if (error) setError("");
  }

  function handleSearch() {
    const trimmed = folio.trim();
    if (!trimmed) return;
    if (!FOLIO_REGEX.test(trimmed)) {
      setError("El formato debe ser VE-2026-A1B2C3. Revisa tu folio e intenta de nuevo.");
      return;
    }
    router.push(`/seguimiento/${trimmed}`);
  }

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
          <div className="flex items-center gap-4">
            <Link href="/" className="hidden sm:block text-sm text-gray-500 hover:text-crimson-600 transition-colors">
              Inicio
            </Link>
            <Link href="/nueva-queja">
              <Button size="sm" className="bg-crimson-600 hover:bg-crimson-700 rounded-none text-xs px-5 h-8 tracking-wide font-semibold">
                Hacer un reporte
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="border border-crimson-200 p-6 sm:p-10">
            <span className="block w-8 h-0.5 bg-crimson-600 mb-6" />
            <div className="flex items-center gap-3 mb-4">
              <Search className="w-5 h-5 text-crimson-600" />
              <h1 className="font-serif text-2xl font-bold text-gray-900">Consultar reporte</h1>
            </div>
            <p className="text-sm text-gray-500 mb-8">
              Ingresa tu número de folio para ver el estado de tu reporte.
            </p>

            <Input
              value={folio}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="VE-2026-A1B2C3"
              className={`text-center font-mono text-lg mb-1 rounded-none focus:border-crimson-600 ${
                error ? "border-red-300 focus:border-red-400" : "border-crimson-200"
              }`}
              onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
              maxLength={12}
            />

            {error ? (
              <div className="flex items-start gap-1.5 mb-4 mt-2">
                <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-xs text-red-600">{error}</p>
              </div>
            ) : (
              <p className="text-[11px] text-gray-400 text-center mb-4 mt-1">
                Formato: VE-2026-A1B2C3
              </p>
            )}

            <Button
              onClick={handleSearch}
              disabled={!folio.trim()}
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
