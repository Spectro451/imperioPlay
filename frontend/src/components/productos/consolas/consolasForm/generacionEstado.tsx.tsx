"use client";
import { Consola, estadoJuego } from "@/types/enums";

interface GeneracionEstadoCampoProps {
  generacion: Consola;
  estado: estadoJuego;
  onGeneracionChange: (generacion: Consola) => void;
  onEstadoChange: (estado: estadoJuego) => void;
}

export default function GeneracionEstadoCampo({
  generacion,
  estado,
  onGeneracionChange,
  onEstadoChange,
}: GeneracionEstadoCampoProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Generación *</label>
        <select
          value={generacion}
          onChange={(e) => onGeneracionChange(e.target.value as Consola)}
          className="w-full border rounded p-2"
        >
          {Object.values(Consola).map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Estado *</label>
        <select
          value={estado}
          onChange={(e) => onEstadoChange(e.target.value as estadoJuego)}
          className="w-full border rounded p-2"
        >
          {Object.values(estadoJuego).map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
