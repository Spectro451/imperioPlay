"use client";
import { buscarNombresProductos } from "@/lib/producto";
import { useEffect, useState, useRef } from "react";

interface ProductoNombreProps {
  value: string;
  onChange: (nombre: string) => void;
  disableSuggestions?: boolean;
}

export default function ProductoNombre({
  value,
  onChange,
  disableSuggestions = false,
}: ProductoNombreProps) {
  const [sugerencias, setSugerencias] = useState<string[]>([]);
  const [buscando, setBuscando] = useState(false);
  const ignoreNextSearchRef = useRef(false);

  useEffect(() => {
    if (disableSuggestions) return;

    const buscar = async () => {
      if (ignoreNextSearchRef.current) {
        ignoreNextSearchRef.current = false;
        return;
      }

      if (value.length < 3) {
        setSugerencias([]);
        return;
      }

      setBuscando(true);
      try {
        const nombres = await buscarNombresProductos(value);
        setSugerencias(nombres);
      } catch {
        setSugerencias([]);
      } finally {
        setBuscando(false);
      }
    };

    const timeoutId = setTimeout(buscar, 300);
    return () => clearTimeout(timeoutId);
  }, [value, disableSuggestions]);

  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        Nombre del Juego *
      </label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border rounded p-2"
          required
          placeholder="Ej: Dark Souls, God of War..."
        />
        {buscando && (
          <div className="mt-2">
            <p className="text-sm">Buscando juegos...</p>
          </div>
        )}
        {!buscando && sugerencias.length > 0 && (
          <div className=" rounded  max-h-60 overflow-y-auto">
            {sugerencias.map((nombre, idx) => (
              <div
                key={idx}
                className="p-3  cursor-pointer border"
                onClick={() => {
                  ignoreNextSearchRef.current = true;
                  onChange(nombre);
                  setSugerencias([]);
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium ">{nombre}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
