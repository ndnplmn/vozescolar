"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Role } from "@/lib/types";
import { GraduationCap, Users, BookOpen, Briefcase, Check } from "lucide-react";

const ROLES: { value: Role; label: string; desc: string; icon: React.ElementType }[] = [
  { value: "alumno",   label: "Alumno",           desc: "Soy estudiante de esta escuela",    icon: GraduationCap },
  { value: "padre",    label: "Padre de Familia",  desc: "Tengo un hijo/a en esta escuela",   icon: Users },
  { value: "docente",  label: "Docente",            desc: "Soy maestro/a o profesor/a",        icon: BookOpen },
  { value: "personal", label: "Personal",           desc: "Trabajo en esta escuela",           icon: Briefcase },
];

export function Step1Role({ onSelect }: { onSelect: (role: Role) => void }) {
  const [selected, setSelected] = useState<Role | null>(null);

  function handleSelect(role: Role) {
    setSelected(role);
    setTimeout(() => onSelect(role), 260);
  }

  return (
    <div>
      <span className="block w-8 h-0.5 bg-crimson-600 mb-5" />
      <h2 className="font-serif text-2xl font-bold text-gray-900 mb-1">¿Quién eres?</h2>
      <p className="text-sm text-gray-500 mb-2">Selecciona tu rol en la comunidad escolar</p>
      <p className="text-xs text-gray-400 mb-6 leading-relaxed">
        Solo usamos esta información para adaptar las preguntas a tu situación. No cambia tu anonimato ni el nivel de atención que recibirá tu reporte.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ROLES.map(({ value, label, desc, icon: Icon }, i) => {
          const isSelected = selected === value;
          return (
            <motion.button
              key={value}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => handleSelect(value)}
              disabled={selected !== null}
              className={`group p-4 border-2 text-left transition-all ${
                isSelected
                  ? "border-crimson-600 bg-crimson-50"
                  : selected !== null
                  ? "border-gray-100 opacity-40"
                  : "border-crimson-200 hover:border-crimson-500 hover:bg-crimson-50/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 transition-colors ${isSelected ? "bg-crimson-600" : "bg-crimson-50 group-hover:bg-crimson-100"}`}>
                  {isSelected
                    ? <Check className="w-5 h-5 text-white" />
                    : <Icon className="w-5 h-5 text-crimson-600" />
                  }
                </div>
                <div>
                  <div className={`font-semibold text-sm ${isSelected ? "text-crimson-700" : "text-gray-800"}`}>
                    {label}
                  </div>
                  <div className="text-xs text-gray-500">{desc}</div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
