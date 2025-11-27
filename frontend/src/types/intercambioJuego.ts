import { rolIntercambio } from "./enums";
import { Intercambio } from "./intercambio";
import { Juego } from "./juego";

export interface IntercambioJuego {
  id: number;
  rol: rolIntercambio;
  cantidad: number;
  intercambio?: Intercambio;
  juego?: Juego;
}
