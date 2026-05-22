import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VozEscolar — CETIS 52 Hermenegildo Galeana",
  description: "Plataforma segura y confidencial para reportar situaciones en el CETIS 52 Hermenegildo Galeana.",
  openGraph: {
    title: "VozEscolar — CETIS 52",
    description: "Buzón oficial confidencial para reportar situaciones en el CETIS 52 Hermenegildo Galeana.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#76082c",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Toaster position="bottom-right" />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
