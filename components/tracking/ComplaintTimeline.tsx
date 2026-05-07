"use client";
import { Complaint } from "@/lib/types";
import { STATUS_LABELS, CATEGORY_LABELS, URGENCY_LABELS, URGENCY_COLORS } from "@/lib/utils";
import { CheckCircle2, Circle } from "lucide-react";

const STATUS_ORDER = ["recibida", "en_revision", "en_proceso", "resuelta"] as const;

export function ComplaintTimeline({ complaint }: { complaint: Complaint }) {
  const currentIdx = STATUS_ORDER.indexOf(complaint.status as typeof STATUS_ORDER[number]);

  return (
    <div className="space-y-6">
      <div className="border border-crimson-200 p-5 space-y-2">
        <span className="block w-8 h-0.5 bg-crimson-600 mb-3" />
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 font-mono">Folio: {complaint.folio}</span>
          <span className={`text-xs px-2 py-0.5 border font-medium ${URGENCY_COLORS[complaint.urgency]}`}>
            {URGENCY_LABELS[complaint.urgency]}
          </span>
        </div>
        <p className="font-semibold text-gray-800 text-sm">{CATEGORY_LABELS[complaint.category]}</p>
        <p className="text-xs text-gray-500">
          {new Date(complaint.createdAt).toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      <div className="relative">
        {STATUS_ORDER.map((status, i) => {
          const timelineEntry = complaint.timeline.find((t) => t.status === status);
          const isDone = i <= currentIdx;
          const isCurrent = i === currentIdx;
          return (
            <div key={status} className="flex gap-4 mb-6">
              <div className="flex flex-col items-center">
                <div className={isDone ? "text-crimson-600" : "text-gray-300"}>
                  {isDone ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                </div>
                {i < STATUS_ORDER.length - 1 && (
                  <div className={`w-0.5 h-8 mt-1 ${isDone ? "bg-crimson-400" : "bg-gray-200"}`} />
                )}
              </div>
              <div className="pt-0.5 pb-4">
                <p className={`text-sm font-semibold ${isCurrent ? "text-crimson-600" : isDone ? "text-gray-700" : "text-gray-400"}`}>
                  {STATUS_LABELS[status]}
                </p>
                {timelineEntry && (
                  <>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(timelineEntry.timestamp).toLocaleString("es-MX")}
                    </p>
                    {timelineEntry.message && (
                      <p className="text-sm text-gray-600 mt-1 bg-crimson-50 border border-crimson-100 px-3 py-2">{timelineEntry.message}</p>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {complaint.adminResponse && (
        <div className="border border-crimson-200 bg-crimson-50 p-4">
          <p className="text-xs text-crimson-600 font-semibold tracking-wide uppercase mb-2">Respuesta oficial</p>
          <p className="text-sm text-gray-700">{complaint.adminResponse}</p>
        </div>
      )}
    </div>
  );
}
