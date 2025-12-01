import { Producto } from "@/types/producto";

interface Props {
  productos: Producto[];
}
export default function ProductosGrid({ productos }: Props) {
  return (
    <section className="p-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 flex-1 content-start">
      {productos.map((producto) =>
        producto.juegos?.map((juego) => (
          <div
            key={juego.id}
            className="w-full aspect-[3/4] border rounded-lg flex flex-col overflow-hidden "
          >
            {juego.fotos?.[0] && (
              <img
                src={juego.fotos[0]}
                alt={producto.nombre}
                className="w-full h-4/5 object-fit"
              />
            )}
            <div className="p-1 flex-1 flex flex-col justify-between">
              <p className="text-m  line-clamp-1" title={producto.nombre}>
                {producto.nombre}
              </p>
              <p className="text-xs text-gray-600">
                {juego.consola} - {juego.estado}
              </p>
              <div className="flex flex-row gap-3 items-baseline">
                {juego.precio_final !== juego.precio_base ? (
                  <>
                    <span className="text-green-600 font-bold">
                      ${juego.precio_final?.toLocaleString()}
                    </span>
                    <span className="text-gray-500 text-xs line-through">
                      ${juego.precio_base?.toLocaleString()}
                    </span>
                  </>
                ) : (
                  <span className="text-green-600 font-bold">
                    ${juego.precio_final?.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </section>
  );
}
