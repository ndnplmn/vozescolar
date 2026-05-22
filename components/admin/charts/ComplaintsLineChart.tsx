"use client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Complaint } from "@/lib/types";

interface TooltipData { active?: boolean; payload?: Array<{ value: number }>; label?: string; }

function CustomTooltip({ active, payload, label }: TooltipData) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 shadow-sm px-3 py-2">
      <p className="text-[11px] text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-gray-900">
        {payload[0].value} {payload[0].value === 1 ? "reporte" : "reportes"}
      </p>
    </div>
  );
}

export function ComplaintsLineChart({ complaints }: { complaints: Complaint[] }) {
  const last30 = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const key = d.toISOString().split("T")[0];
    return {
      date: d.toLocaleDateString("es-MX", { day: "2-digit", month: "short" }),
      count: complaints.filter((c) => c.createdAt.startsWith(key)).length,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={last30} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="crimsonGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#76082c" stopOpacity={0.18} />
            <stop offset="95%" stopColor="#76082c" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: "#9ca3af" }}
          interval={6}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "#9ca3af" }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#76082c", strokeWidth: 1, strokeDasharray: "4 2" }} />
        <Area
          type="monotone"
          dataKey="count"
          stroke="#76082c"
          strokeWidth={2}
          fill="url(#crimsonGrad)"
          dot={false}
          activeDot={{ r: 4, fill: "#76082c", strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
