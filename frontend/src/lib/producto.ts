import { Producto, ProductoFiltro } from "@/types/producto";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

//getall
export async function getProductos(
  filtro: ProductoFiltro = {}
): Promise<{ productos: Producto[]; total: number; totalPaginas: number }> {
  const params = new URLSearchParams();
  if (filtro.nombre) params.set("nombre", filtro.nombre);
  if (filtro.tipo) params.set("tipo", filtro.tipo);
  if (filtro.page) params.set("page", filtro.page.toString());
  if (filtro.consola) params.set("consola", filtro.consola);
  if (filtro.orden) params.set("orden", filtro.orden);
  if (filtro.estado) params.set("estado", filtro.estado);
  if (filtro.sku) params.set("sku", filtro.sku);

  try {
    const res = await fetch(`${API_URL}/producto?${params.toString()}`);
    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
    const json = await res.json();
    return json;
  } catch (error) {
    console.error("Fetch error en getProductos:", error);
    return { productos: [], total: 0, totalPaginas: 0 };
  }
}

//getId
export async function getProductosId(id: number): Promise<Producto> {
  const res = await fetch(`${API_URL}/producto/${id}`);
  if (!res.ok) throw new Error("Error getProductoId");
  return res.json();
}

//getOfertas
export async function getOfertas(
  filtro: ProductoFiltro = {}
): Promise<{ productos: Producto[]; total: number; totalPaginas: number }> {
  const params = new URLSearchParams();
  if (filtro.nombre) params.set("nombre", filtro.nombre);
  if (filtro.tipo) params.set("tipo", filtro.tipo);
  if (filtro.page) params.set("page", filtro.page.toString());
  if (filtro.consola) params.set("consola", filtro.consola);
  if (filtro.orden) params.set("orden", filtro.orden);
  if (filtro.estado) params.set("estado", filtro.estado);
  if (filtro.sku) params.set("sku", filtro.sku);

  try {
    const res = await fetch(`${API_URL}/producto/ofertas?${params.toString()}`);

    if (!res.ok) {
      throw new Error(`Backend error: ${res.status}`);
    }

    const json = await res.json();
    return json;
  } catch (error) {
    console.error("Error en getOfertas:", error);
    return { productos: [], total: 0, totalPaginas: 0 };
  }
}

//editar
export async function putProducto(
  token: string,
  id: number,
  data: Partial<Producto>
): Promise<Producto> {
  if (!token) throw new Error("no se encontro el token de usuario");

  const res = await fetch(`${API_URL}/producto/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al editar producto");
  return res.json();
}

//crear
export async function postProducto(
  token: string,
  data: Partial<Producto>
): Promise<Producto> {
  if (!token) throw new Error("no se encontro el token de usuario");

  const res = await fetch(`${API_URL}/producto/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear producto");
  return res.json();
}

//borrar
export async function deleteProducto(
  token: string,
  id: number
): Promise<{ message: string }> {
  if (!token) throw new Error("no se encontro el token de usuario");

  const res = await fetch(`${API_URL}/producto/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Error al borrar producto");
  return res.json();
}

export async function buscarNombresProductos(
  busqueda?: string
): Promise<string[]> {
  const params = new URLSearchParams();
  if (busqueda) params.set("busqueda", busqueda);

  const res = await fetch(`${API_URL}/producto/nombres?${params.toString()}`);

  if (!res.ok) throw new Error("Error buscando productos");
  return res.json();
}
