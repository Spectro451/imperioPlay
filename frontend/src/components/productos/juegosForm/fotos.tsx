"use client";
import Image from "next/image";
import { useState } from "react";

interface FotosProps {
  archivosPendientes: File[];
  onChangeArchivos: (archivos: File[]) => void;
  fotosExistentes?: string[];
  onBorrarFotoExistente?: (index: number) => void;
}

export default function FotosCampo({
  archivosPendientes,
  onChangeArchivos,
  fotosExistentes = [],
  onBorrarFotoExistente,
}: FotosProps) {
  const [previews, setPreviews] = useState<string[]>([]);

  const handleTakePhoto = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "environment";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setPreviews((prev) => [...prev, previewUrl]);
        onChangeArchivos([...archivosPendientes, file]);
      }
    };
    input.click();
  };

  const removeFoto = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    onChangeArchivos(archivosPendientes.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium">Fotos del Juego</label>

      {fotosExistentes.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Fotos existentes:</p>
          <div className="grid grid-cols-3 gap-2">
            {fotosExistentes.map((foto, index) => (
              <div
                key={`existente-${index}`}
                className="relative aspect-square"
              >
                <Image
                  src={foto}
                  alt={`Foto existente ${index + 1}`}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover rounded border"
                />
                {onBorrarFotoExistente && (
                  <button
                    type="button"
                    onClick={() => onBorrarFotoExistente(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="button"
          onClick={handleTakePhoto}
          className="border rounded p-2 flex-1 text-center"
        >
          📷 Tomar Foto
        </button>
      </div>

      {/* Preview de fotos nuevas */}
      {previews.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Fotos nuevas:</p>
          <div className="grid grid-cols-3 gap-2 justify-items-center">
            {previews.map((previewUrl, index) => (
              <div key={index} className="relative aspect-square">
                <Image
                  src={previewUrl}
                  alt={`Preview ${index + 1}`}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => removeFoto(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
