import { getProductos } from "@/lib/producto";

export default async function ProductosPage() {
  const productos = await getProductos();

  return (
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
  );
}
