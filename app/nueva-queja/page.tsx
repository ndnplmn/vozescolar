import type { Metadata } from "next";
import { IntakeShell } from "@/components/intake/IntakeShell";

export const metadata: Metadata = {
  title: "Nueva queja — VozEscolar CETIS 52",
  description: "Envía un reporte confidencial al CETIS 52 Hermenegildo Galeana de forma anónima y segura.",
  robots: { index: false, follow: false },
};

export default function NuevaQuejaPage() {
  return <IntakeShell />;
}
