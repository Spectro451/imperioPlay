import { Consola, tipoProducto } from "./enums";
import { Juego } from "./juego";

export interface Producto {
  id: number;
  nombre: string;
  tipo: tipoProducto;
  juegos?: Juego[];
}

export interface ProductoFiltro {
  nombre?: string;
  tipo?: tipoProducto;
  page?: number;
  consola?: Consola;
  orden?: "id" | "abc";
}
