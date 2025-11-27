import { metodoPago } from "./enums";
import { Usuario } from "./usuario";
import { VentaDetalle } from "./ventaDetalle";

export interface Venta {
  id: number;
  fecha: Date;
  metodo_pago: metodoPago;
  monto_pagado: number;
  vendedor_id: number;
  cliente_id?: number;
  total: number;
  descuento_porcentaje?: number;
  descuento_fijo?: number;
  cliente?: Usuario;
  vendedor?: Usuario;
  ventaDetalle?: VentaDetalle[];
}
