export type MetodoPago = 'efectivo' | 'debito' | 'credito'
export type TipoItemVenta = 'juego' | 'consola'

export interface VentaItemPayload {
  id: number
  tipo: TipoItemVenta
  cantidad: number
}

export interface CreateVentaPayload {
  descuento_porcentaje?: number
  descuento_fijo?: number
  metodo_pago: MetodoPago
  monto_pagado: number
  items: VentaItemPayload[]
}

export interface VentaDetalleListado {
  nombre: string
  tipo: TipoItemVenta
  estado: string
  cantidad: number
  precio_unitario: number
  subtotal: number
}

export interface VentaListado {
  id: number
  fecha: string
  metodo_pago: MetodoPago
  total: number
  monto_pagado: number
  vuelto?: number
  descuento_porcentaje?: number
  descuento_fijo?: number
  vendedor: { id: number; nombre: string }
  items: VentaDetalleListado[]
}

export type OrdenVentas = 'fecha-asc' | 'fecha-desc' | 'total-asc' | 'total-desc'

export interface FiltroVentasParams {
  page?: number
  limit?: number
  desde?: string
  hasta?: string
  vendedor_id?: number
  metodo_pago?: MetodoPago
  orden?: OrdenVentas
}

export interface RespuestaListadoVentas {
  ventas: VentaListado[]
  totalPaginas: number
  totalRegistros: number
}

export function useVentaApi() {
  const api = useApi()

  async function create(payload: CreateVentaPayload) {
    return api<VentaListado>('/venta', { method: 'POST', body: payload })
  }

  async function getAll(params?: FiltroVentasParams) {
    return api<RespuestaListadoVentas>('/venta', { query: params })
  }

  async function getOne(id: number) {
    return api<VentaListado>(`/venta/${id}`)
  }

  async function remove(id: number) {
    return api<{ mensaje: string }>(`/venta/${id}`, { method: 'DELETE' })
  }

  return { create, getAll, getOne, remove }
}
