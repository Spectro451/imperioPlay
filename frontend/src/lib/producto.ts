import { Producto } from "@/types/producto";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getProductos(): Promise<Producto[]> {
  const res = await fetch(`${API_URL}/producto`);
  if (!res.ok) throw new Error("Error getProductos");
  const json = await res.json();
  return json.productos;
}
