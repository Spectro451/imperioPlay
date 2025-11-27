import { Producto, ProductoFiltro } from "@/types/producto";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getProductos(
  filtro: ProductoFiltro = {}
): Promise<Producto[]> {
  const params = new URLSearchParams();
  if (filtro.nombre) params.set("nombre", filtro.nombre);
  if (filtro.tipo) params.set("tipo", filtro.tipo);
  if (filtro.page) params.set("nombre", filtro.page.toString());
  if (filtro.consola) params.set("nombre", filtro.consola);
  if (filtro.orden) params.set("nombre", filtro.orden);

  const res = await fetch(`${API_URL}/producto?${params.toString()}`);
  if (!res.ok) throw new Error("Error getProductos");
  const json = await res.json();
  return json.productos;
}

export async function getProductosId(id: number): Promise<Producto> {
  const res = await fetch(`${API_URL}/producto/${id}`);
  if (!res.ok) throw new Error("Error getProductoId");
  return res.json();
}
