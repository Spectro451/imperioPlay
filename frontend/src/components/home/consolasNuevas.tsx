import { getProductos } from "@/lib/producto";
import { Orden, tipoProducto } from "@/types/enums";
import Image from "next/image";
import Link from "next/link";

export default async function ConsolasNuevas() {
  const productosData = await getProductos({
    orden: Orden.ID_DESC,
    tipo: tipoProducto.consola,
  });
  const productos = productosData.productos;

  const hayConsolas = productos.some(
    (p) => p.consolas && p.consolas.length > 0
  );

  if (!hayConsolas) {
    return (
      <section className="mx-4 md:mx-10">
        <h1 className="text-center text-[28px] pt-5">Consolas nuevas</h1>
        <div className="flex items-center justify-center p-10">
          <p className="text-gray-500">No hay consolas nuevas disponibles</p>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-x-auto mx-4 md:mx-10">
      <h1 className="text-center text-[28px] pt-5">Consolas nuevas</h1>
      <div className="flex space-x-3 p-2 justify-center min-w-max">
        {productos.slice(0, 6).map((producto) =>
          producto.consolas?.slice(0, 1).map((consola) => (
            <Link
              href={`/productos/consolas/${consola.id}`}
              key={consola.id}
              className="w-[140px] h-[220px] md:w-[200px] md:h-[280px] border-1 flex-shrink-0"
            >
              {consola.fotos?.[0] ? (
                <Image
                  src={consola.fotos[0]}
                  alt={producto.nombre}
                  width={200}
                  height={200}
                  className="w-full h-3/5 md:h-4/6 object-cover"
                />
              ) : (
                <div className="w-full h-3/5 md:h-4/6 flex flex-col items-center justify-center">
                  <p className="text-center p-2">Imagen no disponible</p>
                </div>
              )}

              <div className="p-1 flex-1 flex flex-col justify-between">
                <p className="text-m line-clamp-1" title={producto.nombre}>
                  {producto.nombre}
                </p>
                <p className="text-xs text-gray-600">
                  {consola.generacion} - {consola.estado}
                </p>
                <p className="text-xs line-clamp-1">Stock: {consola.stock}</p>
                <div className="flex flex-row gap-3 items-baseline">
                  {consola.precio_final !== consola.precio_base ? (
                    <>
                      <span className="text-green-600 font-bold">
                        ${consola.precio_final?.toLocaleString()}
                      </span>
                      <span className="text-gray-500 text-xs line-through">
                        ${consola.precio_base?.toLocaleString()}
                      </span>
                    </>
                  ) : (
                    <span className="text-green-600 font-bold">
                      ${consola.precio_final?.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
