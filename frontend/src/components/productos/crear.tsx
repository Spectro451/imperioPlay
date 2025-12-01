"use client";
import { useState, useEffect } from "react";
import { Consola, estadoJuego, tipoProducto } from "@/types/enums";
import { useRouter } from "next/navigation";
import { crearJuego } from "@/lib/juegos";
import { buscarNombresProductos } from "@/lib/producto";

export default function CrearJuegoForm({ token }: { token: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sugerencias, setSugerencias] = useState<string[]>([]);
  const [buscando, setBuscando] = useState(false);

  const [form, setForm] = useState({
    producto: {
      nombre: "",
      tipo: tipoProducto.juego,
    },
    juego: {
      consola: Consola.Ps5,
      estado: estadoJuego.nuevo,
      stock: 1,
      precio_base: 0,
      fotos: [] as string[],
      descuento_porcentaje: 0,
      descuento_fijo: 0,
    },
  });

  useEffect(() => {
    let isMounted = true;

    const fetchSugerencias = async () => {
      if (form.producto.nombre.length > 2) {
        setBuscando(true);
        try {
          const nombres = await buscarNombresProductos(form.producto.nombre);
          if (isMounted) {
            setSugerencias(nombres);
          }
        } catch (err) {
          if (isMounted) {
            setSugerencias([]);
          }
        } finally {
          if (isMounted) {
            setBuscando(false);
          }
        }
      } else {
        if (isMounted) {
          setSugerencias([]);
        }
      }
    };

    const timeoutId = setTimeout(fetchSugerencias, 300);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [form.producto.nombre]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await crearJuego(token, form);
      router.push("/productos/juegos");
    } catch (err: any) {
      setError(err.message || "Error al crear el juego");
    } finally {
      setLoading(false);
    }
  };

  const handleProductoSelect = (nombre: string) => {
    setForm((prev) => ({
      ...prev,
      producto: { ...prev.producto, nombre },
    }));
    setSugerencias([]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">
          Nombre del Juego *
        </label>
        <div className="relative">
          <input
            type="text"
            value={form.producto.nombre}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                producto: { ...prev.producto, nombre: e.target.value },
              }))
            }
            className="w-full border rounded p-2"
            required
            placeholder="Ej: Dark Souls, God of War..."
          />
          {buscando && (
            <div className="absolute top-full left-0 right-0 border   z-10 p-2">
              Buscando...
            </div>
          )}
          {!buscando && sugerencias.length > 0 && (
            <div className="absolute top-full left-0 right-0 border bg-black  z-10 max-h-60 overflow-y-auto">
              {sugerencias.map((nombre, idx) => (
                <div
                  key={idx}
                  className="p-2  cursor-pointer border-b last:border-b-0"
                  onClick={() => handleProductoSelect(nombre)}
                >
                  {nombre}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Consola *</label>
        <select
          value={form.juego.consola}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              juego: { ...prev.juego, consola: e.target.value as Consola },
            }))
          }
          className="w-full border rounded p-2"
        >
          {Object.values(Consola).map((consola) => (
            <option key={consola} value={consola}>
              {consola}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Estado *</label>
        <select
          value={form.juego.estado}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              juego: { ...prev.juego, estado: e.target.value as estadoJuego },
            }))
          }
          className="w-full border rounded p-2"
        >
          {Object.values(estadoJuego).map((estado) => (
            <option key={estado} value={estado}>
              {estado}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Stock *</label>
          <input
            type="numeric"
            min="1"
            value={form.juego.stock}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                juego: {
                  ...prev.juego,
                  stock:
                    e.target.value === "" ? 0 : parseInt(e.target.value) || 0,
                },
              }))
            }
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Precio Base *
          </label>
          <input
            type="numeric"
            min="1"
            value={form.juego.precio_base}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                juego: {
                  ...prev.juego,
                  precio_base:
                    e.target.value === "" ? 0 : parseInt(e.target.value) || 0,
                },
              }))
            }
            className="w-full border rounded p-2"
            required
            placeholder="35000"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Descuento Porcentual (%)
          </label>
          <input
            type="numeric"
            min="0"
            max="100"
            value={form.juego.descuento_porcentaje || 0}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 0;
              setForm((prev) => ({
                ...prev,
                juego: {
                  ...prev.juego,
                  descuento_porcentaje: value,
                  descuento_fijo: 0,
                },
              }));
            }}
            className="w-full border rounded p-2"
            placeholder="0-100%"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Descuento Fijo ($)
          </label>
          <input
            type="numeric"
            min="0"
            value={form.juego.descuento_fijo || 0}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 0;
              setForm((prev) => ({
                ...prev,
                juego: {
                  ...prev.juego,
                  descuento_fijo: value,
                  descuento_porcentaje: 0,
                },
              }));
            }}
            className="w-full border rounded p-2"
            placeholder="Monto fijo"
          />
        </div>
      </div>

      <div className="text-sm text-gray-600">
        {form.juego.descuento_porcentaje > 0 && (
          <p>Descuento porcentual activo: {form.juego.descuento_porcentaje}%</p>
        )}
        {form.juego.descuento_fijo > 0 && (
          <p>Descuento fijo activo: ${form.juego.descuento_fijo}</p>
        )}
        {form.juego.descuento_porcentaje === 0 &&
          form.juego.descuento_fijo === 0 && <p>Sin descuento aplicado</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          URL de Fotos (una por línea)
        </label>
        <textarea
          value={form.juego.fotos?.join("\n") || ""}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              juego: {
                ...prev.juego,
                fotos: e.target.value.split("\n").filter((url) => url.trim()),
              },
            }))
          }
          className="w-full border rounded p-2"
          rows={3}
          placeholder="https://ejemplo.com/foto1.jpg&#10;https://ejemplo.com/foto2.jpg"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full border py-2 px-4 rounded-md disabled:opacity-50"
      >
        {loading ? "Creando..." : "Crear Juego"}
      </button>
    </form>
  );
}
