"use client";

import { subirACloudinary } from "@/lib/cloudinary";
import { crearConsola, editarConsola } from "@/lib/consolas";
import { putProducto } from "@/lib/producto";
import { Consolas } from "@/types/consolas";
import { Consola, estadoJuego, tipoProducto } from "@/types/enums";
import { useRouter } from "next/navigation";
import { useState } from "react";
import BuscarPorSku from "./buscarSku";
import ProductoNombre from "../../juegosForm/nombreProducto";
import GeneracionEstadoCampo from "./generacionEstado.tsx";
import StockPrecioCampo from "../../juegosForm/stockPrecio";
import DescuentoCampos from "../../juegosForm/descuentos";
import FotosCampo from "../../juegosForm/fotos";

export default function ConsolaForm({
  token,
  consolaData,
  modo = "crear",
}: {
  token: string;
  consolaData?: Consolas;
  modo?: "crear" | "editar";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState(() => {
    if (consolaData) {
      return {
        producto: {
          nombre: consolaData.producto?.nombre || "",
          tipo: tipoProducto.consola,
          sku: consolaData.producto?.sku || "",
        },
        consola: {
          generacion: consolaData.generacion,
          estado: consolaData.estado,
          stock: consolaData.stock,
          precio_base: consolaData.precio_base,
          fotos: consolaData.fotos || [],
          descuento_porcentaje: consolaData.descuento_porcentaje || 0,
          descuento_fijo: consolaData.descuento_fijo || 0,
        },
      };
    }

    return {
      producto: {
        nombre: "",
        tipo: tipoProducto.consola,
        sku: "",
      },
      consola: {
        generacion: Consola.Ps5,
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
    consolaData?.fotos || []
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

      if (modo === "editar" && consolaData) {
        const datosActualizacion: Partial<Consolas> = {
          generacion: form.consola.generacion,
          estado: form.consola.estado,
          stock: form.consola.stock,
          precio_base: form.consola.precio_base,
          descuento_porcentaje: form.consola.descuento_porcentaje,
          descuento_fijo: form.consola.descuento_fijo,
          fotos: todasLasFotos,
        };

        await editarConsola(token, consolaData.id, datosActualizacion);
        if (consolaData.producto?.id) {
          const productoCambiado =
            form.producto.nombre !== consolaData.producto.nombre ||
            form.producto.sku !== consolaData.producto.sku;

          if (productoCambiado) {
            await putProducto(token, consolaData.producto.id, {
              nombre: form.producto.nombre,
              sku: form.producto.sku,
            });
          }
        }
      } else {
        await crearConsola(token, {
          ...form,
          producto: {
            ...form.producto,
            sku: form.producto.sku,
          },
          consola: { ...form.consola, fotos: todasLasFotos },
        });
      }

      router.replace("/productos/consolas");
    } catch (err: any) {
      setError(
        err.message ||
          `Error al ${modo === "editar" ? "actualizar" : "crear"} la consola`
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

      <BuscarPorSku
        value={form.producto.sku || ""}
        onChange={(sku) =>
          setForm((prev) => ({
            ...prev,
            producto: { ...prev.producto, sku },
          }))
        }
        onProductoEncontrado={(producto) => {
          if (modo === "crear") {
            const primerConsola = producto.consolas?.[0];

            setForm((prev) => ({
              ...prev,
              producto: {
                ...prev.producto,
                nombre: producto.nombre,
                sku: producto.sku,
              },

              ...(primerConsola && {
                consola: {
                  ...prev.consola,
                  generacion: primerConsola.generacion,
                  stock: primerConsola.stock,
                  precio_base: primerConsola.precio_base,
                },
              }),
            }));
          }
        }}
        modo={modo}
      />

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

      <GeneracionEstadoCampo
        generacion={form.consola.generacion}
        estado={form.consola.estado}
        onGeneracionChange={(generacion) =>
          setForm((prev) => ({
            ...prev,
            consola: { ...prev.consola, generacion },
          }))
        }
        onEstadoChange={(estado) =>
          setForm((prev) => ({
            ...prev,
            consola: { ...prev.consola, estado },
          }))
        }
      />

      <StockPrecioCampo
        stock={form.consola.stock}
        precio={form.consola.precio_base}
        onStockChange={(stock) =>
          setForm((prev) => ({
            ...prev,
            consola: { ...prev.consola, stock },
          }))
        }
        onPrecioChange={(precio) =>
          setForm((prev) => ({
            ...prev,
            consola: { ...prev.consola, precio_base: precio },
          }))
        }
      />

      <DescuentoCampos
        descuentoPorcentaje={form.consola.descuento_porcentaje}
        descuentoFijo={form.consola.descuento_fijo}
        onDescuentoPorcentajeChange={(value) =>
          setForm((prev) => ({
            ...prev,
            consola: { ...prev.consola, descuento_porcentaje: value },
          }))
        }
        onDescuentoFijoChange={(value) =>
          setForm((prev) => ({
            ...prev,
            consola: { ...prev.consola, descuento_fijo: value },
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
        {loading ? "Subiendo fotos y guardando..." : "Guardar Consola"}
      </button>
    </form>
  );
}
