"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { URGENCY_LABELS } from "@/lib/utils";
import { Complaint } from "@/lib/types";

const COLORS: Record<string, string> = { critical: "#ef4444", high: "#f97316", medium: "#eab308", low: "#22c55e" };

export function UrgencyDonut({ complaints }: { complaints: Complaint[] }) {
  const data = Object.entries(URGENCY_LABELS).map(([key, label]) => ({
    name: label,
    value: complaints.filter((c) => c.urgency === key).length,
    color: COLORS[key],
  })).filter((d) => d.value > 0);

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
          {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
        </Pie>
        <Tooltip formatter={(value, name) => [value, name]} />
      </PieChart>
    </ResponsiveContainer>
  );
}
