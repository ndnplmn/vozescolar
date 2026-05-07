"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Category, Urgency, Status } from "@/lib/types";
import { CATEGORY_LABELS, URGENCY_LABELS, STATUS_LABELS } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export interface Filters {
  search: string;
  category: Category | "all";
  urgency: Urgency | "all";
  status: Status | "all";
}

export function FilterBar({ filters, onChange }: { filters: Filters; onChange: (f: Filters) => void }) {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <Input
        placeholder="Buscar..."
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
        className="w-48 rounded-lg"
      />
      {(["category", "urgency", "status"] as const).map((field) => (
        <Select key={field} value={filters[field]} onValueChange={(v) => onChange({ ...filters, [field]: v })}>
          <SelectTrigger className="w-36 rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {field === "category" && Object.entries(CATEGORY_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
            {field === "urgency" && Object.entries(URGENCY_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
            {field === "status" && Object.entries(STATUS_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
      ))}
    </div>
  );
}
