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

export function useConsolaApi() {
  const api = useApi()

  async function getAll(params?: FiltrosApi) {
    const data = await api<{ consolas: any[]; totalPaginas: number }>('/consola', { query: params })
    return { items: data.consolas.map(mapConsola), totalPaginas: data.totalPaginas }
  }

  async function getOne(id: number) {
    return api<any>(`/consola/${id}`)
  }

  return { getAll, getOne }
}
