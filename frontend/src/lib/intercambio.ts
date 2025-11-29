import { Consola, estadoJuego, metodoPago } from "@/types/enums";
import { Intercambio } from "@/types/intercambio";
import { Producto } from "@/types/producto";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

//get intercambio
export async function getIntercambios(token: string): Promise<Intercambio[]> {
  if (!token) throw new Error("Usuario no autorizado");

  const res = await fetch(`${API_URL}/intercambio`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Error al traer intercambios");
  return res.json();
}

//get intercambio id
export async function getIntercambiosId(
  token: string,
  id: number
): Promise<Intercambio> {
  if (!token) throw new Error("Usuario no autorizado");

  const res = await fetch(`${API_URL}/intercambio/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Error al traer el intercambio");
  return res.json();
}

//crearIntercambio
export async function crearIntercambio(
  token: string,
  data: {
    juegosSolicitadosData: Array<{ juegoId: number; cantidad: number }>;
    juegosClienteData: {
      producto: Partial<Producto>;
      consola: Consola;
      estado?: estadoJuego;
      cantidad: number;
      fotos?: string[];
      precio_base: number;
      descuento_porcentaje?: number;
      descuento_fijo?: number;
    }[];
    clienteId?: number;
    dinero_extra?: number;
    metodo_pago?: metodoPago;
  }
): Promise<Intercambio> {
  if (!token) throw new Error("Usuario no autorizado");

  const res = await fetch(`${API_URL}/intercambio/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear el intercambio");
  return res.json();
}

//editar
export async function editarIntercambio(
  token: string,
  id: number,
  data: Partial<Intercambio>
): Promise<Intercambio> {
  if (!token) throw new Error("Usuario no autorizado");

  const res = await fetch(`${API_URL}/intercambio/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al editar el intercambio");
  return res.json();
}

//borrar intercambio
export async function borrarIntercambio(
  token: string,
  id: number
): Promise<void> {
  if (!token) throw new Error("Usuario no autorizado");

  const res = await fetch(`${API_URL}/intercambio/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Error al borrar el intercambio");
  return res.json();
}
