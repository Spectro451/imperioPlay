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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const ignoreNextSearchRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Autocomplete
  useEffect(() => {
    if (disableSuggestions) return;

    let isMounted = true;

    const fetchSugerencias = async () => {
      if (ignoreNextSearchRef.current) {
        ignoreNextSearchRef.current = false;
        return;
      }

      if (value.length > 2) {
        setBuscando(true);
        try {
          const nombres = await buscarNombresProductos(value);
          if (isMounted) {
            setSugerencias(nombres);
            setShowSuggestions(true);
          }
        } catch (err) {
          if (isMounted) {
            setSugerencias([]);
            setShowSuggestions(false);
          }
        } finally {
          if (isMounted) {
            setBuscando(false);
          }
        }
      } else {
        if (isMounted) {
          setSugerencias([]);
          setShowSuggestions(false);
        }
      }
    };

    const timeoutId = setTimeout(fetchSugerencias, 300);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [value, disableSuggestions]);

  // Ocultar sugerencias al perder foco
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProductoSelect = (nombre: string) => {
    ignoreNextSearchRef.current = true;
    onChange(nombre);
    setSugerencias([]);
    setShowSuggestions(false);
  };

  const handleInputFocus = () => {
    if (sugerencias.length > 0 && !disableSuggestions) {
      setShowSuggestions(true);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        Nombre del Juego *
      </label>
      <div className="relative" ref={inputRef}>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleInputFocus}
          className="w-full border rounded p-2"
          required
          placeholder="Ej: Dark Souls, God of War..."
        />
        {buscando && (
          <div className="absolute top-full left-0 right-0 border  z-10 p-2">
            Buscando...
          </div>
        )}
        {!buscando && showSuggestions && sugerencias.length > 0 && (
          <div className="absolute top-full left-0 right-0 border bg-black shadow-lg z-10 max-h-60 overflow-y-auto">
            {sugerencias.map((nombre, idx) => (
              <button
                type="button"
                key={idx}
                className="w-full text-left p-2 border-b last:border-b-0"
                onClick={() => handleProductoSelect(nombre)}
              >
                {nombre}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
