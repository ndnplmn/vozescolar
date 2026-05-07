import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Category, Urgency, Role, Status } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateFolio(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `VE-${year}-${random}`;
}

export async function hashContent(content: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const CATEGORY_LABELS: Record<Category, string> = {
  acoso_escolar: "Acoso Escolar",
  docente: "Docente",
  infraestructura: "Infraestructura",
  administrativo: "Administrativo",
  seguridad: "Seguridad",
  otro: "Otro",
};

export const URGENCY_LABELS: Record<Urgency, string> = {
  critical: "Crítico",
  high: "Alto",
  medium: "Medio",
  low: "Bajo",
};

export const URGENCY_COLORS: Record<Urgency, string> = {
  critical: "bg-red-100 text-red-700 border-red-200",
  high: "bg-orange-100 text-orange-700 border-orange-200",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  low: "bg-green-100 text-green-700 border-green-200",
};

export const STATUS_LABELS: Record<Status, string> = {
  recibida: "Recibida",
  en_revision: "En Revisión",
  en_proceso: "En Proceso",
  resuelta: "Resuelta",
  cerrada: "Cerrada Sin Acción",
};

export const ROLE_LABELS: Record<string, string> = {
  alumno: "Alumno",
  padre: "Padre de Familia",
  docente: "Docente",
  personal: "Personal",
};
