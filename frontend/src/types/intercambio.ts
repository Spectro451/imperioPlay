import { metodoPago } from "./enums";
import { IntercambioJuego } from "./intercambioJuego";
import { Usuario } from "./usuario";

export interface Intercambio {
  id: number;
  fecha: Date;
  metodo_pago?: metodoPago;
  dinero_extra?: number;
  vendedor_id: number;
  cliente_id?: number;
  cliente?: Usuario;
  vendedor?: Usuario;
  intercambioJuegos?: IntercambioJuego[];
}
