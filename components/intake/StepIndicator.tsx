"use client";
import { Check } from "lucide-react";

const STEPS = ["Quién eres", "Cuéntanos", "Categoría", "Evidencia", "Confirmar"];

export function StepIndicator({ current }: { current: number }) {
  return (
    <div className="mb-8" role="list" aria-label="Progreso del formulario">
      <div className="flex items-center justify-center gap-1">
        {STEPS.map((label, i) => {
          const isCompleted = i < current;
          const isActive    = i === current;
          return (
            <div key={i} className="flex items-center" role="listitem">
              <div className="flex flex-col items-center">
                <div
                  aria-current={isActive ? "step" : undefined}
                  aria-label={`Paso ${i + 1}: ${label}${isCompleted ? " (completado)" : isActive ? " (actual)" : ""}`}
                  className={`w-7 h-7 flex items-center justify-center text-xs font-semibold transition-all ${
                    isCompleted
                      ? "bg-crimson-600 text-white"
                      : isActive
                      ? "bg-crimson-600 text-white ring-2 ring-crimson-200 ring-offset-1"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <span className="text-[10px] mt-1 text-gray-400 hidden sm:block whitespace-nowrap">
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 w-5 sm:w-8 mx-1 transition-all ${isCompleted ? "bg-crimson-600" : "bg-gray-200"}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile: show only current step name */}
      <p className="text-center text-[11px] font-semibold text-crimson-600 tracking-wide uppercase mt-2 sm:hidden">
        {STEPS[current]}
      </p>
    </div>
  );
}
