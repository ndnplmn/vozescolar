"use client";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, FileText, UploadCloud, AlertCircle, ArrowRight } from "lucide-react";

const MAX_BYTES = 5 * 1024 * 1024;

export function Step4Evidence({
  onComplete,
}: {
  onComplete: (evidenceBase64?: string, evidenceName?: string) => void;
}) {
  const [file, setFile] = useState<{ name: string; base64: string; isImage: boolean; size: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function processFile(f: File) {
    setError(null);
    if (f.size > MAX_BYTES) {
      setError("El archivo supera el límite de 5 MB. Elige un archivo más pequeño.");
      return;
    }
    const isImage = f.type.startsWith("image/");
    const reader = new FileReader();
    reader.onload = () =>
      setFile({ name: f.name, base64: reader.result as string, isImage, size: f.size });
    reader.readAsDataURL(f);
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) processFile(f);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) processFile(f);
  }

  const sizeLabel = file ? (file.size / 1024 < 1000 ? `${(file.size / 1024).toFixed(0)} KB` : `${(file.size / 1024 / 1024).toFixed(1)} MB`) : "";

  return (
    <div>
      <span className="block w-8 h-0.5 bg-crimson-600 mb-5" />
      <h2 className="font-serif text-2xl font-bold text-gray-900 mb-1">Evidencia (opcional)</h2>
      <p className="text-sm text-gray-500 mb-6">
        Puedes adjuntar una foto o documento que respalde tu reporte. No es obligatorio.
      </p>

      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed p-10 text-center cursor-pointer transition-colors mb-4 ${
              dragging ? "border-crimson-500 bg-crimson-50" : "border-crimson-200 hover:border-crimson-400 hover:bg-crimson-50/40"
            }`}
          >
            <UploadCloud className={`w-8 h-8 mx-auto mb-3 transition-colors ${dragging ? "text-crimson-500" : "text-crimson-300"}`} />
            <p className="text-sm font-medium text-gray-600">
              {dragging ? "Suelta el archivo aquí" : "Toca o arrastra un archivo"}
            </p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG, PDF — máx. 5 MB</p>
            <input ref={inputRef} type="file" className="hidden" accept="image/*,.pdf" onChange={handleInput} />
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4"
          >
            {file.isImage ? (
              <div className="relative border border-crimson-200 overflow-hidden mb-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={file.base64}
                  alt={file.name}
                  className="w-full max-h-52 object-contain bg-gray-50"
                />
                <button
                  onClick={() => setFile(null)}
                  className="absolute top-2 right-2 bg-white border border-gray-200 p-1 hover:bg-red-50 transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-gray-500" />
                </button>
              </div>
            ) : null}
            <div className="flex items-center gap-3 bg-crimson-50 border border-crimson-200 px-3 py-2.5">
              <FileText className="w-4 h-4 text-crimson-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-crimson-700 truncate leading-tight">{file.name}</p>
                <p className="text-[11px] text-crimson-400 mt-0.5">{sizeLabel}</p>
              </div>
              <button
                onClick={() => setFile(null)}
                className="p-1 hover:bg-crimson-100 transition-colors"
                aria-label="Eliminar archivo"
              >
                <X className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-2 bg-red-50 border border-red-200 px-3 py-2.5 mb-4"
          >
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <p className="text-xs text-red-700">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => onComplete()}
          className="flex-1 rounded-none border-crimson-200 text-crimson-600 hover:bg-crimson-50 text-sm"
        >
          Omitir
        </Button>
        <Button
          onClick={() => onComplete(file?.base64, file?.name)}
          className="flex-1 bg-crimson-600 hover:bg-crimson-700 rounded-none h-11 text-sm font-semibold gap-2 group"
        >
          {file ? "Continuar con evidencia" : "Continuar"}
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </div>
    </div>
  );
}
