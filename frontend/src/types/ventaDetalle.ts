import { tipoProducto } from "./enums";
import { Venta } from "./venta";

export interface VentaDetalle {
  id: number;
  venta?: Venta;
  item_id: number;
  tipo: tipoProducto;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}
