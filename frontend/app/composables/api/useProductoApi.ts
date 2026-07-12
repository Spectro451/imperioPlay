import type { ItemFlat, FiltrosApi } from '../useProductoTypes'

function mapVariante(v: any): ItemFlat {
  return {
    id: v.id,
    nombre: v.nombre,
    tipo: v.tipo,
    plataforma: v.plataforma,
    estado: v.variante_estado,
    precio_final: v.precio_final,
    precio_base: v.precio_base,
    descuento_porcentaje: v.descuento_porcentaje,
    descuento_fijo: v.descuento_fijo,
    fotos: v.fotos,
    stock: v.stock,
  }
}

export function useProductoApi() {
  const api = useApi()

  async function getAll(params?: FiltrosApi) {
    const data = await api<{ variantes: any[]; totalPaginas: number }>('/producto/variantes', { query: params })
    return { items: data.variantes.map(mapVariante), totalPaginas: data.totalPaginas }
  }

  async function getOfertas(params?: FiltrosApi) {
    const data = await api<{ variantes: any[]; totalPaginas: number }>('/producto/variantes', { query: { ...params, oferta: 'true' } })
    return { items: data.variantes.map(mapVariante), totalPaginas: data.totalPaginas }
  }

  async function buscarPorSku(sku: string) {
    return api<{ encontrado: boolean; producto?: any }>(`/producto/sku/${encodeURIComponent(sku)}`)
  }

  async function getNombres(busqueda: string) {
    return api<string[]>('/producto/nombres', { query: { busqueda } })
  }

  async function buscarPorNombreExacto(nombre: string) {
    const data = await api<{ productos: any[] }>('/producto', { query: { nombre, limit: 1 } })
    return data.productos.find(p => p.nombre.toLowerCase() === nombre.toLowerCase()) ?? data.productos[0] ?? null
  }

  return { getAll, getOfertas, buscarPorSku, getNombres, buscarPorNombreExacto }
}
