"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BarChart3, Settings } from "lucide-react";

const NAV = [
  { href: "/admin", label: "Bandeja", icon: LayoutDashboard },
  { href: "/admin/analiticas", label: "Analíticas", icon: BarChart3 },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return (
    <div className="min-h-screen bg-white flex">
      <aside className="w-56 bg-crimson-600 text-white flex flex-col py-6 px-4 hidden md:flex shrink-0">
        <div className="flex items-center gap-3 mb-10 px-2">
          <Image src="/cetis52-logo.svg" alt="CETIS 52" width={32} height={32} className="rounded opacity-90" />
          <div>
            <p className="text-[10px] font-semibold tracking-widest text-white/70 uppercase">CETIS 52</p>
            <p className="text-xs font-bold text-white leading-tight">VozEscolar</p>
          </div>
        </div>
        <nav className="space-y-0.5 flex-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors ${
                path === href
                  ? "bg-white/15 text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>
        <p className="text-[10px] text-white/30 px-3 uppercase tracking-widest">Administración</p>
      </aside>
      <main className="flex-1 overflow-auto bg-gray-50">{children}</main>
    </div>
  );
}
