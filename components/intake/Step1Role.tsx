"use client";
import { motion } from "framer-motion";
import { Role } from "@/lib/types";
import { GraduationCap, Users, BookOpen, Briefcase } from "lucide-react";

const ROLES: { value: Role; label: string; desc: string; icon: React.ElementType }[] = [
  { value: "alumno", label: "Alumno", desc: "Soy estudiante de esta escuela", icon: GraduationCap },
  { value: "padre", label: "Padre de Familia", desc: "Tengo un hijo/a en esta escuela", icon: Users },
  { value: "docente", label: "Docente", desc: "Soy maestro/a o profesor/a", icon: BookOpen },
  { value: "personal", label: "Personal", desc: "Trabajo en esta escuela", icon: Briefcase },
];

export function Step1Role({ onSelect }: { onSelect: (role: Role) => void }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-navy-600 mb-2">¿Quién eres?</h2>
      <p className="text-gray-500 mb-6">Selecciona tu rol en la comunidad escolar</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ROLES.map(({ value, label, desc, icon: Icon }, i) => (
          <motion.button
            key={value}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => onSelect(value)}
            className="group p-4 rounded-xl border-2 border-gray-200 hover:border-teal-500 hover:bg-teal-50 text-left transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="bg-navy-50 group-hover:bg-teal-100 rounded-lg p-2 transition-colors">
                <Icon className="w-5 h-5 text-navy-600 group-hover:text-teal-700" />
              </div>
              <div>
                <div className="font-semibold text-gray-800">{label}</div>
                <div className="text-xs text-gray-500">{desc}</div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
