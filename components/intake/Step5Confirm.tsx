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
      <span className="block w-8 h-0.5 bg-crimson-600 mb-5" />
      <h2 className="font-serif text-2xl font-bold text-gray-900 mb-1">Confirmar reporte</h2>
      <p className="text-sm text-gray-500 mb-6">Revisa los detalles antes de enviar.</p>
      <div className="border border-crimson-100 bg-gray-50 p-4 mb-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Rol</span>
          <span className="font-medium text-gray-800">{ROLE_LABELS[role]}</span>
        </div>
        <div className="border-t border-crimson-100 pt-3 flex justify-between text-sm">
          <span className="text-gray-500">Categoría</span>
          <span className="font-medium text-gray-800">{CATEGORY_LABELS[category]}</span>
        </div>
        <div className="border-t border-crimson-100 pt-3 flex justify-between text-sm items-center">
          <span className="text-gray-500">Urgencia</span>
          <span className={`text-xs px-2 py-0.5 border font-medium ${URGENCY_COLORS[urgency]}`}>
            {URGENCY_LABELS[urgency]}
          </span>
        </div>
        <div className="border-t border-crimson-100 pt-3 text-sm">
          <span className="text-gray-500">Descripción</span>
          <p className="mt-1 text-gray-700 line-clamp-3">{content}</p>
        </div>
      </div>
      <div className="flex items-center justify-between border border-crimson-200 bg-crimson-50 p-4 mb-6">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-crimson-600" />
          <div>
            <p className="text-sm font-medium text-gray-800">Modo anónimo</p>
            <p className="text-xs text-gray-500">No se guardará ningún dato personal</p>
          </div>
        </div>
        <Switch checked={isAnonymous} onCheckedChange={setIsAnonymous} />
      </div>
      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-crimson-600 hover:bg-crimson-700 rounded-none py-3 text-sm font-semibold tracking-wide h-auto"
      >
        {loading ? "Enviando..." : "Enviar reporte"}
      </Button>
    </div>
  );
}
