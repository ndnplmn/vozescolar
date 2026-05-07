"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BarChart3, Settings, MessageSquareHeart } from "lucide-react";

const NAV = [
  { href: "/admin", label: "Bandeja", icon: LayoutDashboard },
  { href: "/admin/analiticas", label: "Analíticas", icon: BarChart3 },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-60 bg-navy-600 text-white flex flex-col py-6 px-4 hidden md:flex">
        <div className="flex items-center gap-2 mb-8 px-2">
          <MessageSquareHeart className="w-6 h-6 text-teal-400" />
          <span className="font-bold text-lg">VozEscolar</span>
        </div>
        <nav className="space-y-1 flex-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                path === href ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>
        <p className="text-xs text-white/40 px-2">Panel de Administración</p>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
