import { getOfertas } from "@/lib/producto";
import { Orden } from "@/types/enums";
import Image from "next/image";

export default async function OfertasNuevas() {
  const resultadoData = await getOfertas({ orden: Orden.ID_DESC });
  const productos = resultadoData.productos;

  return (
    <section className="overflow-x-auto mx-4 md:mx-10 mb-10 ">
      <h1 className="text-center text-[28px] pt-5">Ofertas recientes</h1>
      <div className="flex space-x-3 p-2  justify-center min-w-max ">
        {productos.slice(0, 6).map((producto) => (
          <div
            key={producto.id}
            className="w-[130px] h-[200px] md:w-[200px] md:h-[280px] border-1 flex-shrink-0"
          >
            {producto.juegos?.[0]?.fotos?.[0] && (
              <img
                src={producto.juegos[0].fotos[0]}
                alt={producto.nombre}
                width={200}
                height={200}
                className="w-full h-[80%] p-1 rounded-xl object-fit"
              />
            )}
            <div className="p-1 text-center overflow-hidden h-[18%] text-sm md:text-base whitespace-nowrap overflow-ellipsis">
              <div className="truncate" title={producto.nombre}>
                {producto.nombre}
              </div>
              <div className="text-green-600">
                ${producto.juegos?.[0]?.precio_final?.toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
