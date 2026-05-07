"use client";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Paperclip, X, Image, FileText } from "lucide-react";

export function Step4Evidence({
  onComplete,
}: {
  onComplete: (evidenceBase64?: string, evidenceName?: string) => void;
}) {
  const [file, setFile] = useState<{ name: string; base64: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setFile({ name: f.name, base64: reader.result as string });
    reader.readAsDataURL(f);
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-navy-600 mb-2">Evidencia (opcional)</h2>
      <p className="text-gray-500 mb-6">Puedes adjuntar una foto o documento que respalde tu reporte. No es obligatorio.</p>
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 hover:border-teal-400 rounded-xl p-8 text-center cursor-pointer transition-colors mb-4"
      >
        <Paperclip className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500 text-sm">Toca para seleccionar archivo</p>
        <p className="text-gray-400 text-xs mt-1">JPG, PNG, PDF — máx. 5MB</p>
        <input ref={inputRef} type="file" className="hidden" accept="image/*,.pdf" onChange={handleFile} />
      </div>
      {file && (
        <div className="flex items-center gap-3 bg-teal-50 border border-teal-200 rounded-xl p-3 mb-4">
          {file.name.endsWith(".pdf") ? <FileText className="w-5 h-5 text-teal-600" /> : <Image className="w-5 h-5 text-teal-600" />}
          <span className="text-sm text-teal-700 flex-1 truncate">{file.name}</span>
          <button onClick={() => setFile(null)}><X className="w-4 h-4 text-gray-400" /></button>
        </div>
      )}
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => onComplete()} className="flex-1 rounded-xl">Omitir</Button>
        <Button onClick={() => onComplete(file?.base64, file?.name)} className="flex-1 bg-navy-600 hover:bg-navy-700 rounded-xl">
          {file ? "Continuar con evidencia" : "Continuar"}
        </Button>
      </div>
    </div>
  );
}
