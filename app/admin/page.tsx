"use client";
import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ComplaintCard } from "@/components/admin/ComplaintCard";
import { FilterBar, Filters } from "@/components/admin/FilterBar";
import { Complaint } from "@/lib/types";
import { Inbox, AlertTriangle, Clock, CheckCircle2, TrendingUp } from "lucide-react";

export default function AdminPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({ search: "", category: "all", urgency: "all", status: "all" });

  useEffect(() => {
    fetch("/api/admin/complaints")
      .then(r => r.json())
      .then(d => setComplaints(d.complaints ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => complaints.filter(c => {
    if (filters.category !== "all" && c.category !== filters.category) return false;
    if (filters.urgency !== "all" && c.urgency !== filters.urgency) return false;
    if (filters.status !== "all" && c.status !== filters.status) return false;
    if (filters.search && !c.content.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  }), [complaints, filters]);

  const stats = useMemo(() => ({
    total:    complaints.length,
    pending:  complaints.filter(c => c.status === "recibida").length,
    critical: complaints.filter(c => c.urgency === "critical").length,
    resolved: complaints.filter(c => c.status === "resuelta").length,
  }), [complaints]);

  const STATS = [
    { label: "Total reportes",  value: stats.total,    icon: Inbox,         color: "text-gray-700",   bg: "bg-gray-100",   border: "border-l-gray-400" },
    { label: "Sin atender",     value: stats.pending,  icon: Clock,         color: "text-blue-700",   bg: "bg-blue-50",    border: "border-l-blue-400" },
    { label: "Críticos",        value: stats.critical, icon: AlertTriangle, color: "text-red-700",    bg: "bg-red-50",     border: "border-l-red-500" },
    { label: "Resueltos",       value: stats.resolved, icon: CheckCircle2,  color: "text-green-700",  bg: "bg-green-50",   border: "border-l-green-500" },
  ];

  return (
    <AdminLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-6">

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {STATS.map(({ label, value, icon: Icon, color, bg, border }) => (
            <div key={label} className={`bg-white border border-gray-200 border-l-4 ${border} p-4 flex items-center gap-3`}>
              <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center shrink-0`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900 leading-none">
                  {loading ? <span className="inline-block w-6 h-5 bg-gray-200 animate-pulse rounded" /> : value}
                </p>
                <p className="text-[11px] text-gray-500 mt-0.5 font-medium">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Critical alert */}
        {!loading && stats.critical > 0 && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 px-4 py-3">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <p className="text-sm text-red-800 font-medium">
              {stats.critical} reporte{stats.critical > 1 ? "s" : ""} crítico{stats.critical > 1 ? "s" : ""} requiere{stats.critical === 1 ? "" : "n"} atención inmediata.
            </p>
          </div>
        )}

        {/* Filters + list */}
        <div>
          <FilterBar filters={filters} onChange={setFilters} />

          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-gray-400 font-medium">
              {loading ? "Cargando reportes..." : `${filtered.length} resultado${filtered.length !== 1 ? "s" : ""}`}
            </p>
            {filtered.length !== complaints.length && (
              <div className="flex items-center gap-1.5 text-xs text-crimson-600 font-medium">
                <TrendingUp className="w-3 h-3" />
                Filtros activos
              </div>
            )}
          </div>

          <div className="space-y-2">
            {loading && Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 h-24 animate-pulse" />
            ))}

            {!loading && filtered.map((c, i) => (
              <ComplaintCard key={c.id} complaint={c} index={i} />
            ))}

            {!loading && filtered.length === 0 && (
              <div className="text-center py-20 bg-white border border-gray-200">
                <Inbox className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-500">
                  {complaints.length === 0 ? "No se han recibido reportes aún." : "Ningún reporte coincide con los filtros."}
                </p>
                {complaints.length > 0 && (
                  <p className="text-xs text-gray-400 mt-1">Prueba ajustando o limpiando los filtros.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
