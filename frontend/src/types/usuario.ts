import { Rol } from "./enums";
import { Intercambio } from "./intercambio";
import { Venta } from "./venta";

export interface Usuario {
  id: number;
  nombre: string;
  rol: Rol;
  correo: string;
  password: string;
  isActive: boolean;
  intercambiosCliente?: Intercambio[];
  intercambios?: Intercambio[];
  compras?: Venta[];
  ventasVendedor?: Venta[];
}
