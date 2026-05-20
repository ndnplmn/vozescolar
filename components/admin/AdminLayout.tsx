"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LayoutDashboard, BarChart3, Settings, LogOut, BookOpen, Menu, Bell, ArrowUpLeft, AlertTriangle, ChevronRight, X, Clock } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { AdminAuthGuard } from "./AdminAuthGuard";
import { CATEGORY_LABELS, URGENCY_LABELS } from "@/lib/utils";
import { Complaint } from "@/lib/types";

const NAV = [
  { href: "/admin",               label: "Bandeja",       icon: LayoutDashboard, desc: "Reportes recibidos" },
  { href: "/admin/analiticas",    label: "Analíticas",    icon: BarChart3,        desc: "Estadísticas y tendencias" },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings,         desc: "Ajustes del sistema" },
  { href: "/admin/ayuda",         label: "Guía de uso",   icon: BookOpen,         desc: "Manual del administrador" },
];

const PAGE_TITLES: Record<string, string> = {
  "/admin":               "Bandeja de Reportes",
  "/admin/analiticas":    "Analíticas",
  "/admin/configuracion": "Configuración",
  "/admin/ayuda":         "Guía de uso",
};

async function signOut() {
  await fetch("/api/admin/auth", { method: "DELETE" });
  sessionStorage.removeItem("vozescolar_admin_auth");
  window.location.href = "/";
}

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`;
  return `hace ${Math.floor(diff / 86400)} d`;
}

const IDLE_WARNING_MS  = 25 * 60 * 1000; // warn at 25 min
const IDLE_LOGOUT_MS   = 30 * 60 * 1000; // logout at 30 min

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [notifOpen, setNotifOpen]         = useState(false);
  const [alerts, setAlerts]               = useState<Complaint[]>([]);
  const [sessionWarning, setSessionWarning] = useState(false);
  const notifRef  = useRef<HTMLDivElement>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const title   = PAGE_TITLES[path] ?? "Panel de Administración";
  const isQueja = path.startsWith("/admin/queja/");

  // Fetch critical+unattended complaints for notification panel
  useEffect(() => {
    function fetchAlerts() {
      fetch("/api/admin/complaints")
        .then(r => r.ok ? r.json() : { complaints: [] })
        .then(d => {
          const pending = (d.complaints as Complaint[]).filter(
            c => c.urgency === "critical" && c.status === "recibida"
          );
          setAlerts(pending);
        });
    }
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 60_000);
    return () => clearInterval(interval);
  }, [path]);

  // Close panel when clicking outside
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    if (notifOpen) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [notifOpen]);

  // Session idle timeout
  useEffect(() => {
    function resetTimers() {
      setSessionWarning(false);
      if (warnTimer.current) clearTimeout(warnTimer.current);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      warnTimer.current = setTimeout(() => setSessionWarning(true), IDLE_WARNING_MS);
      idleTimer.current = setTimeout(() => signOut(), IDLE_LOGOUT_MS);
    }
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach(e => window.addEventListener(e, resetTimers, { passive: true }));
    resetTimers();
    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimers));
      if (warnTimer.current) clearTimeout(warnTimer.current);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-[#f8f9fb] flex">

        {/* ── Sidebar ── */}
        <aside className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-[#0f1117] flex flex-col
          transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0 md:flex shrink-0
        `}>

          {/* Logo */}
          <div className="px-6 py-6 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-crimson-600 flex items-center justify-center shrink-0">
                <Image src="/cetis52-logo.svg" alt="CETIS 52" width={22} height={22} className="brightness-0 invert" />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase leading-none mb-1">CETIS 52</p>
                <p className="text-sm font-bold text-white leading-none">VozEscolar</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
            <p className="text-[10px] font-bold tracking-[0.15em] text-white/25 uppercase px-3 mb-3">Navegación</p>
            {NAV.map(({ href, label, icon: Icon, desc }) => {
              const active = path === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group
                    ${active
                      ? "bg-crimson-600 text-white shadow-lg shadow-crimson-900/30"
                      : "text-white/50 hover:bg-white/[0.06] hover:text-white/90"
                    }
                  `}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <div className="min-w-0">
                    <p className="leading-none">{label}</p>
                    {!active && <p className="text-[10px] text-white/30 mt-0.5 leading-none truncate">{desc}</p>}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Bottom */}
          <div className="px-3 py-4 border-t border-white/[0.06] space-y-1">
            <Link
              href="/"
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white/40 hover:text-white/80 hover:bg-white/[0.06] rounded-lg transition-all"
            >
              <ArrowUpLeft className="w-4 h-4 shrink-0" />
              Ir al sitio público
            </Link>
            <button
              onClick={signOut}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              Cerrar sesión
            </button>
          </div>
        </aside>

        {/* Mobile overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* ── Main area ── */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Topbar */}
          <header className="sticky top-0 z-20 bg-white border-b border-gray-200/80 px-6 py-0 h-14 flex items-center justify-between shrink-0 shadow-sm">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden p-1.5 text-gray-500 hover:text-gray-800 rounded transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 text-sm">
                {isQueja ? (
                  <>
                    <Link href="/admin" className="text-gray-400 hover:text-crimson-600 transition-colors">Bandeja</Link>
                    <span className="text-gray-300">/</span>
                    <span className="text-gray-700 font-medium">Expediente</span>
                  </>
                ) : (
                  <h1 className="font-semibold text-gray-900">{title}</h1>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Notification bell */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setNotifOpen(v => !v)}
                  className="p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors relative"
                >
                  <Bell className="w-4 h-4" />
                  {alerts.length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 shadow-lg z-50">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <Bell className="w-3.5 h-3.5 text-gray-500" />
                        <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Alertas críticas</p>
                      </div>
                      <button onClick={() => setNotifOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* List */}
                    {alerts.length === 0 ? (
                      <div className="px-4 py-6 text-center">
                        <p className="text-xs text-gray-400">Sin reportes críticos pendientes</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
                        {alerts.map(c => (
                          <Link
                            key={c.id}
                            href={`/admin/queja/${c.id}`}
                            onClick={() => setNotifOpen(false)}
                            className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group"
                          >
                            <div className="w-7 h-7 bg-red-50 flex items-center justify-center shrink-0 mt-0.5">
                              <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-gray-800 truncate">
                                {CATEGORY_LABELS[c.category]}
                              </p>
                              <p className="text-[11px] text-gray-500 mt-0.5 truncate">{c.content}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5">
                                  {URGENCY_LABELS[c.urgency]}
                                </span>
                                <span className="text-[10px] text-gray-400">{timeAgo(c.createdAt)}</span>
                                <span className="text-[10px] font-mono text-gray-400">{c.folio}</span>
                              </div>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-crimson-500 transition-colors shrink-0 mt-1" />
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50">
                      <Link
                        href="/admin"
                        onClick={() => setNotifOpen(false)}
                        className="text-xs text-crimson-600 hover:text-crimson-700 font-medium transition-colors"
                      >
                        Ver bandeja completa →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <div className="w-8 h-8 bg-crimson-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">A</span>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>

      </div>

      {/* Session timeout warning */}
      <AnimatePresence>
        {sessionWarning && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 bg-white border border-amber-300 shadow-xl p-4 max-w-xs w-full"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 bg-amber-50 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Sesión por expirar</p>
                <p className="text-xs text-gray-500 mt-0.5">Tu sesión se cerrará en 5 minutos por inactividad.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setSessionWarning(false); }}
                className="flex-1 h-9 bg-crimson-600 hover:bg-crimson-700 text-white text-xs font-semibold transition-colors"
              >
                Continuar sesión
              </button>
              <button
                onClick={() => signOut()}
                className="h-9 px-3 border border-gray-200 text-xs text-gray-500 hover:bg-gray-50 transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminAuthGuard>
  );
}
