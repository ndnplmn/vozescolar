"use client";
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEFAULT_SCHOOL_CONFIG, SCHOOL_CONFIG_KEY } from "@/lib/config";
import { CheckCircle2 } from "lucide-react";

export default function ConfiguracionPage() {
  const [config, setConfig] = useState(DEFAULT_SCHOOL_CONFIG);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SCHOOL_CONFIG_KEY);
      if (stored) setConfig(JSON.parse(stored));
    } catch {}
  }, []);

  function handleSave() {
    localStorage.setItem(SCHOOL_CONFIG_KEY, JSON.stringify(config));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Configuración</h1>
        <div className="bg-white rounded-xl border p-6 space-y-5">
          <div>
            <Label htmlFor="name">Nombre de la escuela</Label>
            <Input id="name" value={config.name} onChange={(e) => setConfig({ ...config, name: e.target.value })} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="logo">URL del logotipo</Label>
            <Input id="logo" value={config.logoUrl} onChange={(e) => setConfig({ ...config, logoUrl: e.target.value })} placeholder="https://..." className="mt-1.5" />
            {config.logoUrl && <img src={config.logoUrl} alt="Logo preview" className="mt-2 h-12 object-contain rounded" />}
          </div>
          <div>
            <Label htmlFor="color">Color primario</Label>
            <div className="flex items-center gap-3 mt-1.5">
              <input type="color" id="color" value={config.primaryColor} onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })} className="w-10 h-10 rounded-lg border cursor-pointer" />
              <span className="text-sm font-mono text-gray-500">{config.primaryColor}</span>
            </div>
          </div>
          <Button onClick={handleSave} className="w-full bg-navy-600 hover:bg-navy-700 rounded-xl">
            {saved ? <><CheckCircle2 className="w-4 h-4 mr-2" /> Guardado</> : "Guardar cambios"}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
