import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "VozEscolar — CETIS 52 Hermenegildo Galeana",
  description: "Plataforma segura y confidencial para reportar situaciones en el CETIS 52 Hermenegildo Galeana.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
