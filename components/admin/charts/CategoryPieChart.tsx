"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { CATEGORY_LABELS } from "@/lib/utils";
import { Complaint } from "@/lib/types";

const COLORS = ["#1e3a5f", "#0d9488", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

export function CategoryPieChart({ complaints }: { complaints: Complaint[] }) {
  const data = Object.entries(CATEGORY_LABELS).map(([key, label]) => ({
    name: label,
    value: complaints.filter((c) => c.category === key).length,
  })).filter((d) => d.value > 0);

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
