import type { ItemFlat, FiltrosApi } from '../useProductoTypes'

function mapConsola(c: any): ItemFlat {
  return {
    id: c.id,
    nombre: c.producto.nombre,
    tipo: c.producto.tipo,
    plataforma: c.generacion,
    estado: c.estado,
    precio_final: c.precio_final,
    precio_base: c.precio_base,
    descuento_porcentaje: c.descuento_porcentaje,
    descuento_fijo: c.descuento_fijo,
    fotos: c.fotos,
    stock: c.stock,
  }
}

export interface CreateConsolaPayload {
  producto: { nombre: string; tipo: 'consola'; sku?: string }
  consola: {
    generacion?: string
    estado?: string
    stock?: number
    fotos?: string[]
    precio_base: number
    descuento_porcentaje?: number
    descuento_fijo?: number
  }
}

export function useConsolaApi() {
  const api = useApi()

  async function getAll(params?: FiltrosApi) {
    const data = await api<{ consolas: any[]; totalPaginas: number }>('/consola', { query: params })
    return { items: data.consolas.map(mapConsola), totalPaginas: data.totalPaginas }
  }

  async function getOne(id: number) {
    return api<any>(`/consola/${id}`)
  }

  async function create(payload: CreateConsolaPayload) {
    return api<any>('/consola', { method: 'POST', body: payload })
  }

  async function update(id: number, payload: Partial<CreateConsolaPayload['consola']>) {
    return api<any>(`/consola/${id}`, { method: 'PUT', body: payload })
  }

  async function remove(id: number) {
    return api<any>(`/consola/${id}`, { method: 'DELETE' })
  }

  return { getAll, getOne, create, update, remove }
}
