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

export function useJuegoApi() {
  const api = useApi()

  async function getAll(params?: FiltrosApi) {
    const data = await api<{ juegos: any[]; totalPaginas: number }>('/juego', { query: params })
    return { items: data.juegos.map(mapJuego), totalPaginas: data.totalPaginas }
  }

  async function getOne(id: number) {
    return api<any>(`/juego/${id}`)
  }

  return { getAll, getOne }
}
