"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { CATEGORY_LABELS } from "@/lib/utils";
import { Complaint } from "@/lib/types";

const COLORS = ["#76082c", "#0d9488", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 shadow-sm px-3 py-2 text-xs">
      <p className="font-semibold text-gray-800">{payload[0].name}</p>
      <p className="text-gray-500 mt-0.5">{payload[0].value} reporte{payload[0].value !== 1 ? "s" : ""}</p>
    </div>
  );
}

export function CategoryPieChart({ complaints }: { complaints: Complaint[] }) {
  const data = Object.entries(CATEGORY_LABELS).map(([key, label]) => ({
    name: label,
    value: complaints.filter((c) => c.category === key).length,
  })).filter((d) => d.value > 0);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[240px] text-xs text-gray-400">
        Sin datos disponibles
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          outerRadius={75}
          dataKey="value"
          strokeWidth={2}
          stroke="#fff"
        >
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconType="square"
          iconSize={8}
          formatter={(value) => <span className="text-[11px] text-gray-600">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
