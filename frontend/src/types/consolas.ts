import { Consola, estadoJuego } from "./enums";
import { Producto } from "./producto";

export interface Consolas {
  id: number;
  productoId: number;
  stock: number;
  estado: estadoJuego;
  generacion: Consola;
  precio_base: number;
  precio_final: number;
  descuento_porcentaje?: number;
  descuento_fijo?: number;
  fotos?: string[];
  producto?: Producto;
}
