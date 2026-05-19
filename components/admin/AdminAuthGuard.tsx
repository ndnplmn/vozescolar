"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Lock, Eye, EyeOff, ShieldCheck, AlertCircle } from "lucide-react";
import Image from "next/image";

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
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center px-4 relative overflow-hidden">

      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-crimson-600/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        animate={shaking ? { x: [0, -10, 10, -8, 8, -4, 4, 0] } : {}}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Card */}
        <div className="bg-[#1a1d26] border border-white/[0.08] shadow-2xl p-8">

          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-crimson-600/10 border border-crimson-600/20 flex items-center justify-center mb-5">
              <Image src="/cetis52-logo.svg" alt="CETIS 52" width={36} height={36} className="opacity-80" />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-crimson-400" />
              <span className="text-xs font-bold tracking-[0.2em] text-crimson-400 uppercase">Área restringida</span>
            </div>
            <h1 className="text-xl font-bold text-white mb-1">Panel de Administración</h1>
            <p className="text-xs text-white/30 text-center">CETIS 52 Hermenegildo Galeana · VozEscolar</p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wide mb-2">
                Contraseña de acceso
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <Input
                  type={show ? "text" : "password"}
                  value={pin}
                  onChange={(e) => { setPin(e.target.value); setError(false); }}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="••••••••"
                  autoFocus
                  className={`
                    pl-10 pr-10 h-11 bg-white/[0.05] border rounded-none text-white placeholder:text-white/20 text-sm
                    focus-visible:ring-0 focus-visible:ring-offset-0
                    ${error
                      ? "border-red-500/50 focus:border-red-500"
                      : "border-white/10 focus:border-crimson-500"
                    }
                  `}
                />
                <button
                  type="button"
                  onClick={() => setShow(v => !v)}
                  tabIndex={-1}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
                >
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 mt-2"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <p className="text-xs text-red-400">Contraseña incorrecta. Inténtalo de nuevo.</p>
                </motion.div>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={!pin || loading}
              className={`
                w-full h-11 text-sm font-semibold tracking-wide transition-all
                ${loading
                  ? "bg-crimson-700 text-white/70 cursor-not-allowed"
                  : "bg-crimson-600 hover:bg-crimson-500 text-white"
                }
                disabled:opacity-50
              `}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Verificando...
                </span>
              ) : "Ingresar al panel"}
            </button>
          </div>

          <p className="text-[11px] text-white/15 text-center mt-6">
            Solo personal autorizado · La sesión expira al cerrar el navegador
          </p>
        </div>
      </motion.div>
    </div>
  );
}
