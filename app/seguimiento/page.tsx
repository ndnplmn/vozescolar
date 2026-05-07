"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function SeguimientoPage() {
  const [folio, setFolio] = useState("");
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
        <Search className="w-10 h-10 text-teal-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-navy-600 mb-2">Consultar reporte</h1>
        <p className="text-gray-500 mb-6">Ingresa tu número de folio para ver el estado de tu reporte.</p>
        <Input
          value={folio}
          onChange={(e) => setFolio(e.target.value.toUpperCase())}
          placeholder="VE-2026-XXXX"
          className="text-center font-mono text-lg mb-4"
          onKeyDown={(e) => { if (e.key === "Enter" && folio) router.push(`/seguimiento/${folio}`); }}
        />
        <Button
          onClick={() => folio && router.push(`/seguimiento/${folio}`)}
          disabled={!folio}
          className="w-full bg-navy-600 hover:bg-navy-700 rounded-xl"
        >
          Consultar
        </Button>
      </div>
    </div>
  );
}
