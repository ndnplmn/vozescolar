"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Category, Urgency, Status } from "@/lib/types";
import { CATEGORY_LABELS, URGENCY_LABELS, STATUS_LABELS } from "@/lib/utils";
import { Search, SlidersHorizontal, X, AlertTriangle, Inbox, Clock, GraduationCap } from "lucide-react";

export interface Filters {
  search: string;
  category: Category | "all";
  urgency: Urgency | "all";
  status: Status | "all";
}

const EMPTY: Filters = { search: "", category: "all", urgency: "all", status: "all" };

function isFiltered(f: Filters) {
  return f.search || f.category !== "all" || f.urgency !== "all" || f.status !== "all";
}

export function FilterBar({ filters, onChange }: { filters: Filters; onChange: (f: Filters) => void }) {
  const filtered = isFiltered(filters);

  return (
    <div className="space-y-3 mb-6">
      {/* Search + selects row */}
      <div className="flex flex-wrap gap-2">

        {/* Search */}
        <div className="relative w-full sm:flex-1 sm:min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Buscar en reportes..."
            aria-label="Buscar reportes por texto"
            className="w-full h-9 pl-8 pr-3 text-sm border border-gray-200 bg-white focus:border-crimson-400 focus:outline-none transition-colors"
          />
          {filters.search && (
            <button
              onClick={() => onChange({ ...filters, search: "" })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category */}
        <Select value={filters.category} onValueChange={(v) => onChange({ ...filters, category: v as Category | "all" })}>
          <SelectTrigger className={`w-44 h-9 rounded-none text-sm border-gray-200 ${filters.category !== "all" ? "border-crimson-400 bg-crimson-50 text-crimson-700" : ""}`}>
            <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5 text-gray-400 shrink-0" />
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent className="rounded-none">
            <SelectItem value="all">Todas las categorías</SelectItem>
            {Object.entries(CATEGORY_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>

        {/* Urgency */}
        <Select value={filters.urgency} onValueChange={(v) => onChange({ ...filters, urgency: v as Urgency | "all" })}>
          <SelectTrigger className={`w-36 h-9 rounded-none text-sm border-gray-200 ${filters.urgency !== "all" ? "border-crimson-400 bg-crimson-50 text-crimson-700" : ""}`}>
            <SelectValue placeholder="Urgencia" />
          </SelectTrigger>
          <SelectContent className="rounded-none">
            <SelectItem value="all">Toda urgencia</SelectItem>
            {Object.entries(URGENCY_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>

        {/* Status */}
        <Select value={filters.status} onValueChange={(v) => onChange({ ...filters, status: v as Status | "all" })}>
          <SelectTrigger className={`w-36 h-9 rounded-none text-sm border-gray-200 ${filters.status !== "all" ? "border-crimson-400 bg-crimson-50 text-crimson-700" : ""}`}>
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent className="rounded-none">
            <SelectItem value="all">Todo estado</SelectItem>
            {Object.entries(STATUS_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>

        {/* Clear */}
        {filtered && (
          <button
            onClick={() => onChange(EMPTY)}
            className="h-9 px-3 text-xs text-gray-500 hover:text-crimson-600 border border-gray-200 hover:border-crimson-300 bg-white transition-colors flex items-center gap-1.5"
          >
            <X className="w-3 h-3" />
            Limpiar
          </button>
        )}
      </div>

      {/* Quick filter pills */}
      <div className="flex gap-2 flex-wrap" role="group" aria-label="Filtros rápidos">
        {[
          { label: "Solo críticos",  icon: AlertTriangle, apply: () => onChange({ ...EMPTY, urgency: "critical" }),        ariaLabel: "Filtrar: solo reportes críticos" },
          { label: "Sin atender",    icon: Inbox,         apply: () => onChange({ ...EMPTY, status: "recibida" }),          ariaLabel: "Filtrar: reportes sin atender" },
          { label: "En proceso",     icon: Clock,         apply: () => onChange({ ...EMPTY, status: "en_proceso" }),        ariaLabel: "Filtrar: reportes en proceso" },
          { label: "Acoso escolar",  icon: GraduationCap, apply: () => onChange({ ...EMPTY, category: "acoso_escolar" }), ariaLabel: "Filtrar: categoría acoso escolar" },
        ].map(({ label, icon: Icon, apply, ariaLabel }) => (
          <button
            key={label}
            onClick={apply}
            aria-label={ariaLabel}
            className="flex items-center gap-1.5 text-[11px] font-medium px-3 py-1 bg-white border border-gray-200 text-gray-500 hover:border-crimson-300 hover:text-crimson-600 hover:bg-crimson-50 transition-all"
          >
            <Icon className="w-3 h-3" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
