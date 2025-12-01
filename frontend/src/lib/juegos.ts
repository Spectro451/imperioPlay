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
export async function editarJuego(
  token: string,
  id: number,
  data: Partial<Juego>
): Promise<Juego> {
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
export async function crearJuego(
  token: string,
  data: {
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
  }
): Promise<{ producto: Producto; juego: Juego }> {
  if (!token) throw new Error("no se encontro el token de usuario");

  const res = await fetch(`${API_URL}/juego`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    // Intentar obtener el mensaje de error del backend
    const errorData = await res.json().catch(() => ({}));
    const errorMessage = errorData.message || "Error al crear juego";
    throw new Error(errorMessage); // ← Lanza el error específico
  }

  return res.json();
}

//borrar
export async function borrarJuego(token: string, id: number): Promise<void> {
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
  token: string,
  id: number,
  data: { descuento_porcentaje?: number; descuento_fijo?: number }
): Promise<Juego> {
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
