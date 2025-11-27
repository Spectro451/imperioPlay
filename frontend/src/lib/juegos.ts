import { Consola, estadoJuego } from "@/types/enums";
import { Juego } from "@/types/juego";
import { Producto } from "@/types/producto";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

//getId
export async function getJuegoId(id: number): Promise<Juego> {
  const res = await fetch(`${API_URL}/juego/${id}`);
  if (!res.ok) throw new Error("Error getJuegoId");
  return res.json();
}

//editar
export async function putJuego(
  id: number,
  data: Partial<Juego>
): Promise<Juego> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("no se encontro el token de usuario");

  const res = await fetch(`${API_URL}/juego/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al editar juego");
  return res.json();
}

//crear
export async function postJuego(data: {
  producto: Partial<Producto>;
  juego: {
    consola: Consola;
    estado: estadoJuego;
    stock: number;
    fotos?: string[];
    precio_base: number;
    descuento_porcentaje?: number;
    descuento_fijo?: number;
  };
}): Promise<{ producto: Producto; juego: Juego }> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("no se encontro el token de usuario");

  const res = await fetch(`${API_URL}/juego`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear juego");
  return res.json();
}

//borrar
export async function deleteJuego(id: number): Promise<void> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("no se encontro el token de usuario");

  const res = await fetch(`${API_URL}/juego/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Error al borrar juego");
  return;
}

//editarOferta
export async function editarOferta(
  id: number,
  data: { descuento_porcentaje?: number; descuento_fijo?: number }
): Promise<Juego> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("no se encontro el token de usuario");

  const res = await fetch(`${API_URL}/juego/${id}/oferta`, {
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
