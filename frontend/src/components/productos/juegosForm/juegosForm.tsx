"use client";
import { useState } from "react";
import { Consola, estadoJuego, tipoProducto } from "@/types/enums";
import { useRouter } from "next/navigation";
import { crearJuego, editarJuego } from "@/lib/juegos";
import { subirACloudinary } from "@/lib/cloudinary";
import ProductoNombre from "./nombreProducto";
import ConsolaEstadoCampo from "./consolaProducto";
import StockPrecioCampo from "./stockPrecio";
import DescuentoCampos from "./descuentos";
import FotosCampo from "./fotos";
import { Juego } from "@/types/juego";

export default function JuegoForm({
  token,
  juegoData,
  modo = "crear",
}: {
  token: string;
  juegoData?: Juego;
  modo?: "crear" | "editar";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState(() => {
    if (juegoData) {
      return {
        producto: {
          nombre: juegoData.producto?.nombre || "",
          tipo: tipoProducto.juego,
        },
        juego: {
          consola: juegoData.consola,
          estado: juegoData.estado,
          stock: juegoData.stock,
          precio_base: juegoData.precio_base,
          fotos: juegoData.fotos || [],
          descuento_porcentaje: juegoData.descuento_porcentaje || 0,
          descuento_fijo: juegoData.descuento_fijo || 0,
        },
      };
    }

    return {
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
    };
  });

  const [archivosPendientes, setArchivosPendientes] = useState<File[]>([]);
  const [fotosExistentes, setFotosExistentes] = useState<string[]>(
    juegoData?.fotos || []
  );

  const handleBorrarFotoExistente = (index: number) => {
    setFotosExistentes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let fotosSubidas: string[] = [];
      if (archivosPendientes.length > 0) {
        fotosSubidas = await Promise.all(
          archivosPendientes.map((file) => subirACloudinary(file))
        );
      }

      const todasLasFotos = [...fotosExistentes, ...fotosSubidas];

      if (modo === "editar" && juegoData) {
        const datosActualizacion: Partial<Juego> = {
          consola: form.juego.consola,
          estado: form.juego.estado,
          stock: form.juego.stock,
          precio_base: form.juego.precio_base,
          descuento_porcentaje: form.juego.descuento_porcentaje,
          descuento_fijo: form.juego.descuento_fijo,
          fotos: todasLasFotos,
        };

        await editarJuego(token, juegoData.id, datosActualizacion);
      } else {
        await crearJuego(token, {
          ...form,
          juego: { ...form.juego, fotos: todasLasFotos },
        });
      }

      router.replace("/productos/juegos");
    } catch (err: any) {
      setError(
        err.message ||
          `Error al ${modo === "editar" ? "actualizar" : "crear"} el juego`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <ProductoNombre
        value={form.producto.nombre}
        onChange={(nombre) =>
          setForm((prev) => ({
            ...prev,
            producto: { ...prev.producto, nombre },
          }))
        }
        disableSuggestions={modo === "editar"}
      />

      <ConsolaEstadoCampo
        consola={form.juego.consola}
        estado={form.juego.estado}
        onConsolaChange={(consola) =>
          setForm((prev) => ({
            ...prev,
            juego: { ...prev.juego, consola },
          }))
        }
        onEstadoChange={(estado) =>
          setForm((prev) => ({
            ...prev,
            juego: { ...prev.juego, estado },
          }))
        }
      />

      <StockPrecioCampo
        stock={form.juego.stock}
        precio={form.juego.precio_base}
        onStockChange={(stock) =>
          setForm((prev) => ({
            ...prev,
            juego: { ...prev.juego, stock },
          }))
        }
        onPrecioChange={(precio) =>
          setForm((prev) => ({
            ...prev,
            juego: { ...prev.juego, precio_base: precio },
          }))
        }
      />

      <DescuentoCampos
        descuentoPorcentaje={form.juego.descuento_porcentaje}
        descuentoFijo={form.juego.descuento_fijo}
        onDescuentoPorcentajeChange={(value) =>
          setForm((prev) => ({
            ...prev,
            juego: { ...prev.juego, descuento_porcentaje: value },
          }))
        }
        onDescuentoFijoChange={(value) =>
          setForm((prev) => ({
            ...prev,
            juego: { ...prev.juego, descuento_fijo: value },
          }))
        }
      />

      <FotosCampo
        archivosPendientes={archivosPendientes}
        onChangeArchivos={setArchivosPendientes}
        fotosExistentes={fotosExistentes}
        onBorrarFotoExistente={handleBorrarFotoExistente}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full border py-2 px-4 rounded-md disabled:opacity-50"
      >
        {loading ? "Subiendo fotos y guardando..." : "Guardar Juego"}
      </button>
    </form>
  );
}
