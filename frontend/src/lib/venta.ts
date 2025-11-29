import { metodoPago, tipoProducto } from "@/types/enums";
import { Venta } from "@/types/venta";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

//crear venta
export async function crearVenta(
  token: string,
  data: {
    cliente_id?: number;
    descuento_porcentaje?: number;
    descuento_fijo?: number;
    metodo_pago: metodoPago;
    monto_pagado: number;
    items: { id: number; tipo: tipoProducto; cantidad: number }[];
  }
): Promise<Venta> {
  if (!token) throw new Error("Usuario no autorizado");

  const res = await fetch(`${API_URL}/venta`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Error al crear venta");
  return res.json();
}

//editar venta
export async function editarVenta(
  token: string,
  id: number,
  data: Partial<Venta>
) {
  if (!token) throw new Error("Usuario no autorizado");

  const res = await fetch(`${API_URL}/venta/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al editar venta");
  return res.json();
}

//getAll
export async function getVentas(token: string): Promise<Venta[]> {
  if (!token) throw new Error("Usuario no autorizado");
  const res = await fetch(`${API_URL}/venta`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error("Error al traer ventas: " + res.status);
  }

  return res.json();
}

//getId venta
export async function getVentasId(token: string, id: number): Promise<Venta> {
  if (!token) throw new Error("Usuario no autorizado");
  const res = await fetch(`${API_URL}/venta/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error("Error al traer venta: " + res.status);
  }

  return res.json();
}

//borrar venta
export async function borrarVenta(token: string, id: number) {
  if (!token) throw new Error("Usuario no autorizado");

  const res = await fetch(`${API_URL}/venta/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Error al borrar venta");
  return res.json();
}
