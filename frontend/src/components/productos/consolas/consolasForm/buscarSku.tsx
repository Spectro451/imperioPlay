"use client";
import { useState, useEffect } from "react";
import { buscarProductoPorSku } from "@/lib/producto";

interface BuscarPorSkuProps {
  value: string;
  onChange: (sku: string) => void;
  onProductoEncontrado: (producto: any) => void;
  disabled?: boolean;
  modo?: "crear" | "editar";
}

export default function BuscarPorSku({
  value,
  onChange,
  onProductoEncontrado,
  disabled = false,
  modo = "crear",
}: BuscarPorSkuProps) {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [debouncedSku, setDebouncedSku] = useState(value);

  useEffect(() => {
    if (modo === "editar") return;

    const timer = setTimeout(() => {
      setDebouncedSku(value);
    }, 500);

    return () => clearTimeout(timer);
  }, [value, modo]);

  useEffect(() => {
    if (modo === "editar") return;

    const buscarSku = async () => {
      if (!debouncedSku || debouncedSku.trim().length < 3) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const resultado = await buscarProductoPorSku(debouncedSku);

        if (resultado.encontrado && resultado.producto) {
          if (resultado.producto.tipo === "consola") {
            setSuggestions([resultado.producto]);
          } else {
            setSuggestions([]);
          }
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Error buscando SKU:", error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    buscarSku();
  }, [debouncedSku, modo]);

  const handleSelectProducto = (producto: any) => {
    onProductoEncontrado(producto);
    setSuggestions([]);
  };

  if (modo === "editar") {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium">SKU</label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full border p-2 rounded disabled:cursor-not-allowed"
          placeholder="SKU del producto"
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">SKU</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className="w-full border p-2 rounded "
        placeholder="Ingresa SKU (mínimo 3 caracteres)"
      />

      {loading && <p className="text-sm ">Buscando producto...</p>}
      {suggestions.length > 0 && (
        <div className="border rounded-lg mt-2 max-h-60 overflow-y-auto">
          {suggestions.map((producto) => (
            <div
              key={producto.id}
              className="p-3"
              onClick={() => handleSelectProducto(producto)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="">{producto.nombre}</p>
                  <p className="text-sm  mt-1">
                    <span className="font-medium">SKU:</span> {producto.sku}
                  </p>
                </div>
              </div>

              {producto.consolas && producto.consolas.length > 0 && (
                <div className="mt-3 pt-2 border-t ">
                  <p className=" mb-1">Variantes disponibles:</p>
                  <div className="space-y-1">
                    {producto.consolas.map((consola: any, index: number) => (
                      <div key={index} className="flex items-center text-xs ">
                        <span className="w-2 h-2  rounded-full mr-2 border"></span>
                        <span className="font-medium">
                          {consola.generacion}
                        </span>
                        <span className="mx-1">•</span>
                        <span className="capitalize">{consola.estado}</span>
                        <span className="mx-1">•</span>
                        <span>Stock: {consola.stock}</span>
                        <span className="mx-1">•</span>
                        <span className="font-bold text-green-700">
                          ${consola.precio_final?.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
