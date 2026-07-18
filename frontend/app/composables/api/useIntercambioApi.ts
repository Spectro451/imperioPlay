import type { MetodoPago } from './useVentaApi'

export type Plataforma =
  | 'Xbox360' | 'XboxOne' | 'XboxSeries'
  | 'Ps3' | 'Ps4' | 'Ps5'
  | 'Switch' | 'Switch2'

export type EstadoJuego = 'nuevo' | 'usado'
export type RolIntercambio = 'solicitado' | 'entregado'

export interface JuegoSolicitadoPayload {
  juegoId: number
  cantidad?: number
}

export interface JuegoClientePayload {
  producto: { nombre: string; tipo: 'juego'; sku: string }
  consola: Plataforma
  estado?: EstadoJuego
  cantidad: number
  fotos?: string[]
  precio_base: number
  descuento_porcentaje?: number
  descuento_fijo?: number
}

export interface CreateIntercambioPayload {
  juegosSolicitadosData: JuegoSolicitadoPayload[]
  juegosClienteData: JuegoClientePayload[]
  vendedor_id?: number
  monto_pagado?: number
  metodo_pago?: MetodoPago
}

export interface DetalleIntercambioListado {
  juego_id: number
  rol: RolIntercambio
  cantidad: number
  nombre: string
  sku?: string
  consola: Plataforma
  estado: EstadoJuego
  tier: number
}

export interface IntercambioListado {
  id: number
  fecha: string
  metodo_pago?: MetodoPago
  dinero_extra?: number
  monto_pagado?: number
  vuelto?: number
  vendedor: { id: number; nombre: string }
  cliente?: { id: number; nombre: string }
  items: DetalleIntercambioListado[]
}

export type OrdenIntercambios =
  | 'fecha-asc' | 'fecha-desc'
  | 'dinero-asc' | 'dinero-desc'

export interface FiltroIntercambiosParams {
  page?: number
  limit?: number
  desde?: string
  hasta?: string
  vendedor_id?: number
  metodo_pago?: MetodoPago
  orden?: OrdenIntercambios
}

export interface RespuestaListadoIntercambios {
  intercambios: IntercambioListado[]
  totalPaginas: number
  totalRegistros: number
}

export interface RespuestaCrearIntercambio {
  intercambio: { id: number; fecha: string }
  dinero_extra: number
  monto_pagado: number
  vuelto: number
}

export function useIntercambioApi() {
  const api = useApi()

  async function create(payload: CreateIntercambioPayload) {
    return api<RespuestaCrearIntercambio>('/intercambio', { method: 'POST', body: payload })
  }

  async function getAll(params?: FiltroIntercambiosParams) {
    return api<RespuestaListadoIntercambios>('/intercambio', { query: params })
  }

  async function getOne(id: number) {
    return api<IntercambioListado>(`/intercambio/${id}`)
  }

  async function remove(id: number) {
    return api<{ mensaje: string }>(`/intercambio/${id}`, { method: 'DELETE' })
  }

  return { create, getAll, getOne, remove }
}
