"use client";
import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ComplaintCard } from "@/components/admin/ComplaintCard";
import { FilterBar, Filters } from "@/components/admin/FilterBar";
import { Complaint } from "@/lib/types";

export default function AdminPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({ search: "", category: "all", urgency: "all", status: "all" });

  useEffect(() => {
    fetch("/api/admin/complaints")
      .then((r) => r.json())
      .then((d) => setComplaints(d.complaints ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      if (filters.category !== "all" && c.category !== filters.category) return false;
      if (filters.urgency !== "all" && c.urgency !== filters.urgency) return false;
      if (filters.status !== "all" && c.status !== filters.status) return false;
      if (filters.search && !c.content.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }, [complaints, filters]);

  const criticalCount = filtered.filter((c) => c.urgency === "critical").length;

  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <span className="block w-8 h-0.5 bg-crimson-600 mb-3" />
            <h1 className="font-serif text-2xl font-bold text-gray-900">Bandeja de Reportes</h1>
            <p className="text-gray-500 text-sm mt-1">
              {loading ? "Cargando..." : `${filtered.length} reportes`}
            </p>
          </div>
          {criticalCount > 0 && (
            <div className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 font-medium">
              {criticalCount} crítico{criticalCount > 1 ? "s" : ""}
            </div>
          )}
        </div>
        <FilterBar filters={filters} onChange={setFilters} />
        <div className="space-y-2">
          {loading && (
            <div className="text-center py-16 text-gray-400 text-sm">Cargando reportes...</div>
          )}
          {!loading && filtered.map((c, i) => <ComplaintCard key={c.id} complaint={c} index={i} />)}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400 text-sm">
              No se encontraron reportes con los filtros seleccionados.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
