import { getProductos } from "@/lib/producto";
import { Consola, Orden, tipoProducto } from "@/types/enums";

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const params = await searchParams;
  const productos = await getProductos({
    nombre: params.nombre,
    tipo: params.tipo as tipoProducto,
    page: params.page ? Number(params.page) : undefined,
    consola: params.consola as Consola,
    orden: params.orden as Orden,
  });

  return (
    <div>
      <form action="/productos" method="get">
        <input
          name="nombre"
          defaultValue={params.nombre || ""}
          placeholder="Buscar producto"
        />

        <label>
          <input
            type="checkbox"
            name="estado"
            value="nuevo"
            defaultChecked={params.tipo === "estado"}
          />
          nuevos
        </label>
        <button type="submit">Buscar</button>
      </form>
      <ul>
        {productos.map((p) => (
          <li key={p.id}>
            <strong>{p.nombre}</strong>
            <ul>
              {p.juegos?.map((j) => (
                <li key={j.id}>
                  {j.consola} - {j.estado}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
