"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Category, Urgency, Role } from "@/lib/types";
import { CATEGORY_LABELS, URGENCY_LABELS, URGENCY_COLORS, ROLE_LABELS } from "@/lib/utils";
import { Shield } from "lucide-react";

export function Step5Confirm({
  role,
  content,
  category,
  urgency,
  onSubmit,
}: {
  role: Role;
  content: string;
  category: Category;
  urgency: Urgency;
  onSubmit: (isAnonymous: boolean) => void;
}) {
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    await onSubmit(isAnonymous);
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-navy-600 mb-2">Confirmar reporte</h2>
      <p className="text-gray-500 mb-6">Revisa los detalles antes de enviar.</p>
      <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Rol</span>
          <span className="font-medium">{ROLE_LABELS[role]}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Categoría</span>
          <span className="font-medium">{CATEGORY_LABELS[category]}</span>
        </div>
        <div className="flex justify-between text-sm items-center">
          <span className="text-gray-500">Urgencia</span>
          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${URGENCY_COLORS[urgency]}`}>
            {URGENCY_LABELS[urgency]}
          </span>
        </div>
        <div className="text-sm">
          <span className="text-gray-500">Descripción</span>
          <p className="mt-1 text-gray-700 line-clamp-3">{content}</p>
        </div>
      </div>
      <div className="flex items-center justify-between bg-navy-50 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-navy-600" />
          <div>
            <p className="text-sm font-medium text-navy-700">Modo anónimo</p>
            <p className="text-xs text-gray-500">No se guardará ningún dato personal</p>
          </div>
        </div>
        <Switch checked={isAnonymous} onCheckedChange={setIsAnonymous} />
      </div>
      <Button onClick={handleSubmit} disabled={loading} className="w-full bg-teal-600 hover:bg-teal-700 rounded-xl py-3 text-base font-semibold">
        {loading ? "Enviando..." : "Enviar reporte"}
      </Button>
    </div>
  );
}
