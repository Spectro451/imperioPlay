import { Consolas } from "@/types/consolas";
import { Juego } from "@/types/juego";
import { Producto } from "@/types/producto";
import Image from "next/image";
import Link from "next/link";

interface Props {
  productos: Producto[];
}
export default function ProductosGrid({ productos }: Props) {
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

  return (
    <section className="p-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 flex-1 content-start">
      {items.map((item) => (
        <Link
          href={`/productos/${item.tipo}/${item.id}`}
          key={`${item.tipo}-${item.id}`}
          className="w-full aspect-[3/4] border rounded-lg flex flex-col overflow-hidden"
        >
          {item.fotos?.[0] && (
            <Image
              src={item.fotos[0]}
              alt={item.productoNombre}
              width={200}
              height={200}
              className="w-full h-4/5 object-fit"
            />
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
            <div className="flex flex-row gap-3 items-baseline">
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
    </section>
  );
}
