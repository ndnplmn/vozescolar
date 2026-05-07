"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Complaint } from "@/lib/types";

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
      <LineChart data={last30}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={6} />
        <YAxis tick={{ fontSize: 10 }} />
        <Tooltip />
        <Line type="monotone" dataKey="count" stroke="#0d9488" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
