"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Lock, Eye, EyeOff, ShieldAlert, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const SESSION_KEY = "vozescolar_admin_auth";

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [show, setShow] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAuthenticated(sessionStorage.getItem(SESSION_KEY) === "1");
  }, []);

  async function handleSubmit() {
    if (!pin) return;
    setLoading(true);
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    });
    setLoading(false);
    if (res.ok) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setAuthenticated(true);
    } else {
      setError(true);
      setShaking(true);
      setPin("");
      setTimeout(() => setShaking(false), 500);
      setTimeout(() => setError(false), 3500);
    }
  }

  if (authenticated === null) return null;
  if (authenticated) return <>{children}</>;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <motion.div
        animate={shaking ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : {}}
        transition={{ duration: 0.45 }}
        className="w-full max-w-sm"
      >
        <div className="border border-crimson-200 p-10">
          <div className="flex flex-col items-center mb-8">
            <Image src="/cetis52-logo.svg" alt="CETIS 52" width={48} height={48} className="mb-5 opacity-80" />
            <span className="block w-8 h-0.5 bg-crimson-600 mb-4" />
            <h1 className="font-serif text-xl font-bold text-gray-900 mb-1">Acceso restringido</h1>
            <p className="text-xs text-gray-500 text-center">Portal de administración del CETIS 52</p>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type={show ? "text" : "password"}
                value={pin}
                onChange={(e) => { setPin(e.target.value); setError(false); }}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="Contraseña de acceso"
                className={`pl-9 pr-10 rounded-none text-sm ${
                  error ? "border-red-300 focus:border-red-400" : "border-crimson-200 focus:border-crimson-600"
                }`}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShow(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <p className="text-xs text-red-600">Contraseña incorrecta.</p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!pin || loading}
              className="w-full h-10 bg-crimson-600 hover:bg-crimson-700 disabled:opacity-50 text-white text-sm font-semibold tracking-wide transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Verificando...
                </>
              ) : "Ingresar"}
            </button>
          </div>

          <p className="text-[11px] text-gray-400 text-center mt-6">
            Solo personal autorizado del CETIS 52
          </p>
        </div>

        <div className="text-center mt-5">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-crimson-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver al sitio público
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
