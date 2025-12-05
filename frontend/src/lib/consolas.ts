import { Consola, estadoJuego } from "@/types/enums";
import { Consolas } from "@/types/consolas";
import { Producto } from "@/types/producto";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

//getId
export async function getConsolaId(id: number): Promise<Consolas> {
  const res = await fetch(`${API_URL}/consola/${id}`);
  if (!res.ok) throw new Error("Error getConsolaId");
  return res.json();
}

//editar
export async function editarConsola(
  token: string,
  id: number,
  data: Partial<Consolas>
): Promise<Consolas> {
  if (!token) throw new Error("no se encontro el token de usuario");

  const res = await fetch(`${API_URL}/consola/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al editar consola");
  return res.json();
}

//crear
export async function crearConsola(
  token: string,
  data: {
    producto: Partial<Producto>;
    consola: {
      estado?: estadoJuego;
      generacion?: Consola;
      stock?: number;
      fotos?: string[];
      precio_base: number;
      descuento_porcentaje?: number;
      descuento_fijo?: number;
    };
  }
): Promise<{ producto: Producto; consola: Consolas }> {
  if (!token) throw new Error("no se encontro el token de usuario");

  const res = await fetch(`${API_URL}/consola`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const errorMessage = errorData.message || "Error al crear consola";
    throw new Error(errorMessage);
  }

  return res.json();
}

//borrar
export async function borrarConsola(token: string, id: number): Promise<void> {
  if (!token) throw new Error("no se encontro el token de usuario");

  const res = await fetch(`${API_URL}/consola/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Error al borrar consola");
  return;
}

//editarOferta
export async function editarOfertaConsola(
  token: string,
  id: number,
  data: { descuento_porcentaje?: number; descuento_fijo?: number }
): Promise<Consolas> {
  if (!token) throw new Error("no se encontro el token de usuario");

  const res = await fetch(`${API_URL}/consola/${id}/oferta`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al editar oferta");
  return res.json();
}
