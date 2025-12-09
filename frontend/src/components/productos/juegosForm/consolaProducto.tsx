"use client";
import { Consola, estadoJuego } from "@/types/enums";

interface ConsolaEstadoCampoProps {
  consola: Consola;
  estado: estadoJuego;
  onConsolaChange: (consola: Consola) => void;
  onEstadoChange: (estado: estadoJuego) => void;
}

export default function ConsolaEstadoCampo({
  consola,
  estado,
  onConsolaChange,
  onEstadoChange,
}: ConsolaEstadoCampoProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Consola *</label>
        <select
          value={consola}
          onChange={(e) => onConsolaChange(e.target.value as Consola)}
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
