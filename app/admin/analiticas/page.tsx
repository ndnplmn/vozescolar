"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Complaint } from "@/lib/types";

const CategoryPieChart = dynamic(
  () => import("@/components/admin/charts/CategoryPieChart").then(m => ({ default: m.CategoryPieChart })),
  { ssr: false, loading: () => <div className="h-48 bg-gray-100 animate-pulse" /> }
);
const UrgencyDonut = dynamic(
  () => import("@/components/admin/charts/UrgencyDonut").then(m => ({ default: m.UrgencyDonut })),
  { ssr: false, loading: () => <div className="h-48 bg-gray-100 animate-pulse" /> }
);
const ComplaintsLineChart = dynamic(
  () => import("@/components/admin/charts/ComplaintsLineChart").then(m => ({ default: m.ComplaintsLineChart })),
  { ssr: false, loading: () => <div className="h-48 bg-gray-100 animate-pulse" /> }
);
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle2, Inbox, PercentIcon, Clock, Timer } from "lucide-react";

export default function AnalyticsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [narrative, setNarrative] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingNarrative, setLoadingNarrative] = useState(true);

  useEffect(() => {
    fetch("/api/admin/complaints")
      .then(r => r.json())
      .then(d => {
        const all: Complaint[] = d.complaints ?? [];
        setComplaints(all);
        setLoading(false);
        fetch("/api/ai/monthly-summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ complaints: all.slice(0, 15) }),
        }).then(r => r.json()).then(d => setNarrative(d.narrative ?? "")).finally(() => setLoadingNarrative(false));
      });
  }, []);

  const total    = complaints.length;
  const critical = complaints.filter(c => c.urgency === "critical").length;
  const resolved = complaints.filter(c => c.status === "resuelta").length;
  const rate     = total ? Math.round((resolved / total) * 100) : 0;

  const overdue7 = complaints.filter(c => {
    if (["resuelta", "cerrada"].includes(c.status)) return false;
    return (Date.now() - new Date(c.createdAt).getTime()) > 7 * 86400000;
  }).length;

  const resolvedWithTimeline = complaints.filter(
    c => c.status === "resuelta" && c.timeline.some(t => t.status === "resuelta")
  );
  const avgHours = resolvedWithTimeline.length
    ? Math.round(resolvedWithTimeline.reduce((sum, c) => {
        const created = new Date(c.createdAt).getTime();
        const resolved = new Date(c.timeline.find(t => t.status === "resuelta")!.timestamp).getTime();
        return sum + (resolved - created) / 3600000;
      }, 0) / resolvedWithTimeline.length)
    : null;
  const avgLabel = avgHours === null ? "—" : avgHours < 24 ? `${avgHours}h` : `${Math.round(avgHours / 24)}d`;

  const METRICS = [
    { label: "Total reportes",    value: total,     icon: Inbox,         color: "text-gray-600",   bg: "bg-gray-100",   accent: "border-l-gray-400"   },
    { label: "Críticos",          value: critical,  icon: AlertTriangle, color: "text-red-600",    bg: "bg-red-50",     accent: "border-l-red-500"    },
    { label: "% Resolución",      value: `${rate}%`,icon: PercentIcon,   color: "text-purple-600", bg: "bg-purple-50",  accent: "border-l-purple-500" },
    { label: "Tiempo prom. cierre",value: avgLabel, icon: Timer,         color: "text-blue-600",   bg: "bg-blue-50",    accent: "border-l-blue-500"   },
    { label: "Resueltos",         value: resolved,  icon: CheckCircle2,  color: "text-green-600",  bg: "bg-green-50",   accent: "border-l-green-500"  },
    { label: "Pendientes >7 días", value: overdue7, icon: Clock,         color: overdue7 > 0 ? "text-orange-600" : "text-gray-400", bg: overdue7 > 0 ? "bg-orange-50" : "bg-gray-100", accent: overdue7 > 0 ? "border-l-orange-500" : "border-l-gray-300" },
  ];

  return (
    <AdminLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-6">

        {/* Metric cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {METRICS.map(({ label, value, icon: Icon, color, bg, accent }) => (
            <div key={label} className={`bg-white border border-gray-200 border-l-4 ${accent} p-5`}>
              {loading ? (
                <div className="space-y-2">
                  <div className="h-8 w-12 bg-gray-200 animate-pulse rounded" />
                  <div className="h-3 w-20 bg-gray-100 animate-pulse rounded" />
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-3">
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    <div className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 ${color}`} />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">{label}</p>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-crimson-600" />
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Por categoría</p>
            </div>
            {loading
              ? <div className="h-48 bg-gray-100 animate-pulse" />
              : <CategoryPieChart complaints={complaints} />
            }
          </div>
          <div className="bg-white border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-crimson-600" />
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Por urgencia</p>
            </div>
            {loading
              ? <div className="h-48 bg-gray-100 animate-pulse" />
              : <UrgencyDonut complaints={complaints} />
            }
          </div>
        </div>

        {/* Line chart */}
        <div className="bg-white border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-crimson-600" />
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Reportes — últimos 30 días</p>
          </div>
          {loading
            ? <div className="h-48 bg-gray-100 animate-pulse" />
            : <ComplaintsLineChart complaints={complaints} />
          }
        </div>

        {/* AI Narrative */}
        <div className="bg-white border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-crimson-600/10 rounded flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-crimson-600" />
              </div>
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Resumen mensual · Generado por IA</p>
            </div>
            <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 font-medium uppercase tracking-wide">
              {new Date().toLocaleDateString("es-MX", { month: "long", year: "numeric" })}
            </span>
          </div>
          <div className="p-5">
            {loadingNarrative ? (
              <div className="space-y-2">
                <div className="h-4 bg-gray-100 animate-pulse" />
                <div className="h-4 bg-gray-100 animate-pulse w-5/6" />
                <div className="h-4 bg-gray-100 animate-pulse w-4/6" />
              </div>
            ) : narrative ? (
              <p className="text-sm text-gray-700 leading-relaxed">{narrative}</p>
            ) : (
              <p className="text-sm text-gray-400 italic">No hay suficientes datos para generar un resumen este mes.</p>
            )}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
