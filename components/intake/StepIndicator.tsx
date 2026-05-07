"use client";
import { Check } from "lucide-react";

const STEPS = ["Quién eres", "Cuéntanos", "Categoría", "Evidencia", "Confirmar"];

export function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-1 mb-8">
      {STEPS.map((label, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 flex items-center justify-center text-xs font-semibold transition-all ${
              i < current ? "bg-crimson-600 text-white" :
              i === current ? "bg-crimson-600 text-white ring-2 ring-crimson-200" :
              "bg-gray-100 text-gray-400"
            }`}>
              {i < current ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <span className="text-[10px] mt-1 text-gray-500 hidden sm:block">{label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`h-0.5 w-6 sm:w-10 mx-1 transition-all ${i < current ? "bg-crimson-600" : "bg-gray-200"}`} />
          )}
        </div>
      ))}
    </div>
  );
}
