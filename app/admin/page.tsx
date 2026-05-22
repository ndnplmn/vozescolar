"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ComplaintCard } from "@/components/admin/ComplaintCard";
import { FilterBar, Filters } from "@/components/admin/FilterBar";
import { Complaint } from "@/lib/types";
import { Inbox, AlertTriangle, Clock, CheckCircle2, Activity, RefreshCw, Filter } from "lucide-react";

export default function AdminPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters]       = useState<Filters>({ search: "", category: "all", urgency: "all", status: "all" });

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const r = await fetch("/api/admin/complaints");
      const d = await r.json();
      setComplaints(d.complaints ?? []);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(() => load(true), 60_000);
    return () => clearInterval(interval);
  }, [load]);

  const filtered = useMemo(() => complaints.filter(c => {
    if (filters.category !== "all" && c.category !== filters.category) return false;
    if (filters.urgency !== "all" && c.urgency !== filters.urgency) return false;
    if (filters.status !== "all" && c.status !== filters.status) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const inContent  = c.content.toLowerCase().includes(q);
      const inFolio    = c.folio.toLowerCase().includes(q);
      const inCategory = c.category.toLowerCase().includes(q);
      if (!inContent && !inFolio && !inCategory) return false;
    }
    return true;
  }), [complaints, filters]);

  const stats = useMemo(() => ({
    total:      complaints.length,
    pending:    complaints.filter(c => c.status === "recibida").length,
    inProgress: complaints.filter(c => c.status === "en_proceso" || c.status === "en_revision").length,
    critical:   complaints.filter(c => c.urgency === "critical").length,
    resolved:   complaints.filter(c => c.status === "resuelta").length,
  }), [complaints]);

  const STATS = [
    { label: "Total reportes", value: stats.total,      icon: Inbox,         alert: false },
    { label: "Sin atender",    value: stats.pending,    icon: Clock,         alert: stats.pending > 0 },
    { label: "En proceso",     value: stats.inProgress, icon: Activity,      alert: false },
    { label: "Críticos",       value: stats.critical,   icon: AlertTriangle, alert: stats.critical > 0 },
    { label: "Resueltos",      value: stats.resolved,   icon: CheckCircle2,  alert: false },
  ];

  const isFiltered = filtered.length !== complaints.length;

  return (
    <AdminLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-6">

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {STATS.map(({ label, value, icon: Icon, alert }) => (
            <div key={label} className="bg-white border border-gray-100 shadow-sm p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">{label}</p>
                <Icon className="w-3.5 h-3.5 text-gray-300" />
              </div>
              <p className={`text-2xl font-bold tabular-nums leading-none ${alert ? "text-red-600" : "text-gray-900"}`}>
                {loading ? <span className="inline-block w-8 h-6 bg-gray-100 animate-pulse rounded" /> : value}
              </p>
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
            <div className="flex items-center gap-3">
              {isFiltered && (
                <div className="flex items-center gap-1.5 text-xs text-crimson-600 font-medium">
                  <Filter className="w-3 h-3" />
                  Filtros activos
                </div>
              )}
              <button
                onClick={() => load(true)}
                disabled={refreshing}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${refreshing ? "animate-spin" : ""}`} />
                Actualizar
              </button>
            </div>
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
