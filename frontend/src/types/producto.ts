import { Consolas } from "./consolas";
import { Consola, estadoJuego, Orden, tipoProducto } from "./enums";
import { Juego } from "./juego";

export interface Producto {
  id: number;
  nombre: string;
  tipo: tipoProducto;
  juegos?: Juego[];
  consolas?: Consolas[];
  sku?: string;
}

export interface ProductoFiltro {
  nombre?: string;
  tipo?: tipoProducto;
  page?: number;
  consola?: Consola;
  orden?: Orden;
  estado?: estadoJuego;
  sku?: string;
}
