"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, ShieldAlert, Eye, EyeOff } from "lucide-react";
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
      setTimeout(() => setError(false), 3000);
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
                onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
                placeholder="Contraseña de acceso"
                className={`pl-9 pr-10 rounded-none text-sm ${
                  error ? "border-red-300 focus:border-red-400" : "border-crimson-200 focus:border-crimson-600"
                }`}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
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

            <Button
              onClick={handleSubmit}
              disabled={!pin || loading}
              className="w-full bg-crimson-600 hover:bg-crimson-700 rounded-none text-sm font-semibold tracking-wide disabled:opacity-60"
            >
              {loading ? "Verificando..." : "Ingresar"}
            </Button>
          </div>

          <p className="text-[11px] text-gray-400 text-center mt-6">
            Solo personal autorizado del CETIS 52
          </p>
        </div>
      </motion.div>
    </div>
  );
}
