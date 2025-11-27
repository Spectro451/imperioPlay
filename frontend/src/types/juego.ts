import { Consola, estadoJuego } from "./enums";
import { IntercambioJuego } from "./intercambioJuego";
import { Producto } from "./producto";

export interface Juego {
  id: number;
  productoId: number;
  stock: number;
  consola: Consola;
  estado: estadoJuego;
  precio_base: number;
  precio_final: number;
  descuento_porcentaje?: number;
  descuento_fijo?: number;
  tier: number;
  fotos?: string[];
  producto?: Producto;
  intercambioJuegos?: IntercambioJuego;
}
