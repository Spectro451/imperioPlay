import { metodoPago, tipoProducto } from "@/types/enums";
import { Venta } from "@/types/venta";
import { getCookie } from "@/utils/cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function crearVenta(data: {
  cliente_id?: number;
  descuento_porcentaje?: number;
  descuento_fijo?: number;
  metodo_pago: metodoPago;
  monto_pagado: number;
  items: { id: number; tipo: tipoProducto; cantidad: number }[];
}): Promise<Venta> {
  const token = localStorage.getItem("token");
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

export async function getVentas(token: string): Promise<Venta[]> {
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
