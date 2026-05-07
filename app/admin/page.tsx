"use client";
import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ComplaintCard } from "@/components/admin/ComplaintCard";
import { FilterBar, Filters } from "@/components/admin/FilterBar";
import { MOCK_COMPLAINTS } from "@/lib/mock-data";
import { getLocalComplaints } from "@/lib/storage";
import { Complaint } from "@/lib/types";

export default function AdminPage() {
  const [local, setLocal] = useState<Complaint[]>([]);
  const [filters, setFilters] = useState<Filters>({ search: "", category: "all", urgency: "all", status: "all" });

  useEffect(() => { setLocal(getLocalComplaints()); }, []);

  const all = useMemo(() => {
    const merged = [...local, ...MOCK_COMPLAINTS].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return merged.filter((c) => {
      if (filters.category !== "all" && c.category !== filters.category) return false;
      if (filters.urgency !== "all" && c.urgency !== filters.urgency) return false;
      if (filters.status !== "all" && c.status !== filters.status) return false;
      if (filters.search && !c.content.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }, [local, filters]);

  const criticalCount = all.filter((c) => c.urgency === "critical").length;

  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bandeja de Reportes</h1>
            <p className="text-gray-500 text-sm">{all.length} reportes totales</p>
          </div>
          {criticalCount > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-700 font-medium">
              {criticalCount} crítico{criticalCount > 1 ? "s" : ""}
            </div>
          )}
        </div>
        <FilterBar filters={filters} onChange={setFilters} />
        <div className="space-y-3">
          {all.map((c, i) => <ComplaintCard key={c.id} complaint={c} index={i} />)}
          {all.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p>No se encontraron reportes con los filtros seleccionados.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
