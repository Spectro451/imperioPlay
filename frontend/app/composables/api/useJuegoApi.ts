import type { ItemFlat, FiltrosApi } from '../useProductoTypes'

function mapJuego(j: any): ItemFlat {
  return {
    id: j.id,
    nombre: j.producto.nombre,
    tipo: j.producto.tipo,
    plataforma: j.consola,
    estado: j.estado,
    precio_final: j.precio_final,
    precio_base: j.precio_base,
    descuento_porcentaje: j.descuento_porcentaje,
    descuento_fijo: j.descuento_fijo,
    fotos: j.fotos,
    stock: j.stock,
  }
}

export interface CreateJuegoPayload {
  producto: { nombre: string; tipo: 'juego'; sku?: string }
  juego: {
    consola: string
    estado: string
    stock?: number
    fotos?: string[]
    precio_base: number
    descuento_porcentaje?: number
    descuento_fijo?: number
  }
}

export function useJuegoApi() {
  const api = useApi()

  async function getAll(params?: FiltrosApi) {
    const data = await api<{ juegos: any[]; totalPaginas: number }>('/juego', { query: params })
    return { items: data.juegos.map(mapJuego), totalPaginas: data.totalPaginas }
  }

  async function getOne(id: number) {
    return api<any>(`/juego/${id}`)
  }

  async function create(payload: CreateJuegoPayload) {
    return api<any>('/juego', { method: 'POST', body: payload })
  }

  async function update(id: number, payload: Partial<CreateJuegoPayload['juego']>) {
    return api<any>(`/juego/${id}`, { method: 'PUT', body: payload })
  }

  async function remove(id: number) {
    return api<any>(`/juego/${id}`, { method: 'DELETE' })
  }

  return { getAll, getOne, create, update, remove }
}
