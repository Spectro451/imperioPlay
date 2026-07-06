import type { ItemFlat } from '../useProductoTypes'

function aplanar(productos: any[]): ItemFlat[] {
  return productos.flatMap((p) => {
    const variantes = p.tipo === 'juego' ? (p.juegos ?? []) : (p.consolas ?? [])
    return variantes.map((v: any) => ({
      id: v.id, nombre: p.nombre, tipo: p.tipo,
      plataforma: v.consola ?? v.generacion ?? '',
      estado: v.estado, precio_final: v.precio_final, precio_base: v.precio_base,
      descuento_porcentaje: v.descuento_porcentaje, descuento_fijo: v.descuento_fijo,
      fotos: v.fotos, stock: v.stock,
    }))
  })
}

export function useProductoApi() {
  const api = useApi()

  async function getAll(params?: { page?: number; tipo?: string; orden?: string; estado?: string; consola?: string }) {
    const data = await api<{ productos: any[]; totalPaginas: number }>('/producto', { query: params })
    return { items: aplanar(data.productos), totalPaginas: data.totalPaginas }
  }

  async function getOfertas(params?: { page?: number }) {
    const data = await api<{ productos: any[]; totalPaginas: number }>('/producto/ofertas', { query: params })
    return { items: aplanar(data.productos), totalPaginas: data.totalPaginas }
  }

  return { getAll, getOfertas }
}
