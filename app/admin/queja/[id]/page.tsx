"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MOCK_COMPLAINTS } from "@/lib/mock-data";
import { getLocalComplaints } from "@/lib/storage";
import { Complaint } from "@/lib/types";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AIPanel } from "@/components/admin/AIPanel";
import { CATEGORY_LABELS, URGENCY_LABELS, URGENCY_COLORS, STATUS_LABELS, ROLE_LABELS } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ComplaintDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [complaint, setComplaint] = useState<Complaint | null>(null);

  useEffect(() => {
    const all = [...getLocalComplaints(), ...MOCK_COMPLAINTS];
    setComplaint(all.find((c) => c.id === id) ?? null);
  }, [id]);

  if (!complaint) return null;

  return (
    <AdminLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <Link href="/admin" className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm mb-6">
          <ArrowLeft className="w-4 h-4" /> Volver a bandeja
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl border p-6">
              <div className="flex items-start justify-between mb-4">
                <span className="font-mono text-sm text-gray-400">{complaint.folio}</span>
                <span className={`text-xs px-2 py-1 rounded-full border font-medium ${URGENCY_COLORS[complaint.urgency]}`}>
                  {URGENCY_LABELS[complaint.urgency]}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{CATEGORY_LABELS[complaint.category]}</span>
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{ROLE_LABELS[complaint.role]}</span>
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{STATUS_LABELS[complaint.status]}</span>
              </div>
              <p className="text-gray-700 leading-relaxed">{complaint.content}</p>
              <p className="text-xs text-gray-400 mt-4">
                Recibido el {new Date(complaint.createdAt).toLocaleString("es-MX")}
              </p>
            </div>
          </div>
          <div className="lg:col-span-1">
            <AIPanel complaint={complaint} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
