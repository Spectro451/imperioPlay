import { tipoProducto } from "./enums";
import { Juego } from "./juego";

export interface Producto {
  id: number;
  nombre: string;
  tipo: tipoProducto;
  juegos?: Juego[];
}
