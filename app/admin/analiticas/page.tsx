"use client";
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { CategoryPieChart } from "@/components/admin/charts/CategoryPieChart";
import { UrgencyDonut } from "@/components/admin/charts/UrgencyDonut";
import { ComplaintsLineChart } from "@/components/admin/charts/ComplaintsLineChart";
import { MOCK_COMPLAINTS } from "@/lib/mock-data";
import { getLocalComplaints } from "@/lib/storage";
import { Complaint } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [narrative, setNarrative] = useState("");
  const [loadingNarrative, setLoadingNarrative] = useState(true);

  useEffect(() => {
    const all = [...getLocalComplaints(), ...MOCK_COMPLAINTS];
    setComplaints(all);
    fetch("/api/ai/monthly-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ complaints: all.slice(0, 15) }),
    }).then((r) => r.json()).then((d) => setNarrative(d.narrative ?? "")).finally(() => setLoadingNarrative(false));
  }, []);

  const critical = complaints.filter((c) => c.urgency === "critical").length;
  const resolved = complaints.filter((c) => c.status === "resuelta").length;

  return (
    <AdminLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="mb-8">
          <span className="block w-8 h-0.5 bg-crimson-600 mb-3" />
          <h1 className="font-serif text-2xl font-bold text-gray-900">Analíticas</h1>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total reportes", value: complaints.length },
            { label: "Críticos", value: critical },
            { label: "Resueltos", value: resolved },
            { label: "% Resolución", value: `${complaints.length ? Math.round((resolved / complaints.length) * 100) : 0}%` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-crimson-600">{value}</p>
              <p className="text-xs text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white border border-gray-200 p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Por categoría</p>
            <CategoryPieChart complaints={complaints} />
          </div>
          <div className="bg-white border border-gray-200 p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Por urgencia</p>
            <UrgencyDonut complaints={complaints} />
          </div>
        </div>
        <div className="bg-white border border-gray-200 p-4 mb-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Reportes últimos 30 días</p>
          <ComplaintsLineChart complaints={complaints} />
        </div>
        <div className="border border-crimson-200 bg-crimson-50 p-5">
          <p className="text-xs font-semibold text-crimson-600 uppercase tracking-wide mb-3">Resumen mensual — IA</p>
          {loadingNarrative ? <Skeleton className="h-16 w-full" /> : (
            <p className="text-sm text-gray-700 leading-relaxed">{narrative}</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
