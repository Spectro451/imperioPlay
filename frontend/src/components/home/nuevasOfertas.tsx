import { getOfertas } from "@/lib/producto";
import { Consolas } from "@/types/consolas";
import { Orden } from "@/types/enums";
import { Juego } from "@/types/juego";
import Image from "next/image";
import Link from "next/link";

export default async function OfertasNuevas() {
  const resultadoData = await getOfertas({ orden: Orden.ID_DESC });
  const productos = resultadoData.productos;

  const items = productos.flatMap((producto) => [
    ...(producto.juegos?.map((j) => ({
      ...j,
      tipo: "juegos",
      productoNombre: producto.nombre,
    })) || []),
    ...(producto.consolas?.map((c) => ({
      ...c,
      tipo: "consolas",
      productoNombre: producto.nombre,
    })) || []),
  ]);

  const primerosItems = items.slice(0, 6);

  if (primerosItems.length === 0) {
    return (
      <section className="mx-4 md:mx-10 mb-10">
        <h1 className="text-center text-[28px] pt-5">Ofertas recientes</h1>
        <div className="flex items-center justify-center p-10">
          <p className="text-gray-500">No hay ofertas disponibles</p>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-x-auto mx-4 md:mx-10 mb-10">
      <h1 className="text-center text-[28px] pt-5">Ofertas recientes</h1>
      <div className="flex space-x-3 p-2 justify-center min-w-max">
        {primerosItems.map((item) => (
          <Link
            href={`/productos/${item.tipo}/${item.id}`}
            key={`${item.tipo}-${item.id}`}
            className="w-[140px] h-[220px] md:w-[200px] md:h-[280px] border-1 flex-shrink-0"
          >
            {item.fotos?.[0] ? (
              <Image
                src={item.fotos[0]}
                alt={item.productoNombre}
                width={200}
                height={200}
                className="w-full h-3/5 md:h-4/6 object-fit"
              />
            ) : (
              <div className="w-full h-3/5 md:h-4/6 flex flex-col items-center justify-center">
                <p className="text-center p-2">Imagen no disponible</p>
              </div>
            )}

            <div className="p-1 flex-1 flex flex-col justify-between">
              <p className="text-m line-clamp-1" title={item.productoNombre}>
                {item.productoNombre}
              </p>
              <p className="text-xs text-gray-600">
                {item.tipo === "juegos"
                  ? `${(item as Juego).consola} - ${item.estado}`
                  : `${(item as Consolas).generacion} - ${item.estado}`}
              </p>
              <p className="text-xs line-clamp-1">Stock: {item.stock}</p>
              <div className="flex flex-col md:flex-row md:gap-3 items-baseline">
                {item.precio_final !== item.precio_base ? (
                  <>
                    <span className="text-green-600 font-bold">
                      ${item.precio_final?.toLocaleString()}
                    </span>
                    <span className="text-gray-500 text-xs line-through">
                      ${item.precio_base?.toLocaleString()}
                    </span>
                  </>
                ) : (
                  <span className="text-green-600 font-bold">
                    ${item.precio_final?.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
