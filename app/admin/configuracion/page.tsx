"use client";
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEFAULT_SCHOOL_CONFIG, SCHOOL_CONFIG_KEY } from "@/lib/config";
import { CheckCircle2, School, Palette, Image as ImageIcon, Shield, Info } from "lucide-react";

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
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-2xl mx-auto space-y-5">

        {/* Institución */}
        <div className="bg-white border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <School className="w-4 h-4 text-crimson-600" />
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Información de la institución</p>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <Label htmlFor="name" className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">
                Nombre de la escuela
              </Label>
              <Input
                id="name"
                value={config.name}
                onChange={e => setConfig({ ...config, name: e.target.value })}
                className="rounded-none border-gray-200 focus:border-crimson-400 focus-visible:ring-0 h-10"
              />
            </div>
          </div>
        </div>

        {/* Logo */}
        <div className="bg-white border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-crimson-600" />
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Logotipo</p>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <Label htmlFor="logo" className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">
                URL del logotipo
              </Label>
              <Input
                id="logo"
                value={config.logoUrl}
                onChange={e => setConfig({ ...config, logoUrl: e.target.value })}
                placeholder="https://ejemplo.com/logo.svg"
                className="rounded-none border-gray-200 focus:border-crimson-400 focus-visible:ring-0 h-10"
              />
            </div>
            {config.logoUrl && (
              <div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={config.logoUrl} alt="Vista previa del logo" className="h-12 object-contain" />
                <div>
                  <p className="text-xs font-semibold text-gray-700">Vista previa</p>
                  <p className="text-xs text-gray-400 mt-0.5">Así aparecerá en el buzón</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Color */}
        <div className="bg-white border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <Palette className="w-4 h-4 text-crimson-600" />
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Color primario</p>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-4">
              <label htmlFor="color" className="cursor-pointer">
                <div
                  className="w-12 h-12 border-2 border-white shadow-md ring-1 ring-gray-200 cursor-pointer transition-transform hover:scale-105"
                  style={{ backgroundColor: config.primaryColor }}
                />
                <input
                  type="color"
                  id="color"
                  value={config.primaryColor}
                  onChange={e => setConfig({ ...config, primaryColor: e.target.value })}
                  className="sr-only"
                />
              </label>
              <div>
                <p className="text-sm font-bold text-gray-900 font-mono">{config.primaryColor.toUpperCase()}</p>
                <p className="text-xs text-gray-400 mt-0.5">Clic en el color para cambiar</p>
              </div>
              <div
                className="ml-auto px-4 py-2 text-white text-xs font-bold"
                style={{ backgroundColor: config.primaryColor }}
              >
                Muestra
              </div>
            </div>
          </div>
        </div>

        {/* Security note */}
        <div className="bg-white border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <Shield className="w-4 h-4 text-crimson-600" />
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Seguridad</p>
          </div>
          <div className="p-6">
            <div className="flex gap-3">
              <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <div className="text-sm text-gray-600 leading-relaxed space-y-1">
                <p>La <strong>contraseña de acceso al panel</strong> se configura en las variables de entorno del servidor (<code className="text-xs bg-gray-100 px-1.5 py-0.5">ADMIN_PIN</code>).</p>
                <p className="text-xs text-gray-400">Para cambiarla, contacta al administrador técnico del sistema o actualiza la variable en el panel de Vercel.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          className={`w-full h-11 text-sm font-bold tracking-wide transition-all flex items-center justify-center gap-2 ${
            saved
              ? "bg-green-600 text-white"
              : "bg-crimson-600 hover:bg-crimson-700 text-white"
          }`}
        >
          {saved ? (
            <><CheckCircle2 className="w-4 h-4" /> Cambios guardados</>
          ) : (
            "Guardar cambios"
          )}
        </button>

      </div>
    </AdminLayout>
  );
}
