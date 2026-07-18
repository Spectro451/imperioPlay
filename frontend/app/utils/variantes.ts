import type { ItemFlat } from '~/composables/useProductoTypes'
import { calcularTier } from '~/utils/tiers'

interface VarianteRaw {
  id: number
  stock: number
  estado: string
  precio_base: number
  precio_final: number
  descuento_porcentaje?: number
  descuento_fijo?: number
  fotos?: string[]
  isActive: boolean
  consola?: string
  generacion?: string
}

interface ProductoConRelaciones {
  nombre: string
  sku?: string
  juegos?: VarianteRaw[]
  consolas?: VarianteRaw[]
}

export function aplanarVariantes(producto: ProductoConRelaciones): ItemFlat[] {
  const nombre = producto.nombre
  const sku = producto.sku

  const juegos = (producto.juegos ?? []).map<ItemFlat>(j => ({
    id: j.id,
    nombre,
    sku,
    tipo: 'juego',
    plataforma: j.consola ?? '',
    estado: j.estado,
    precio_final: j.precio_final,
    precio_base: j.precio_base,
    descuento_porcentaje: j.descuento_porcentaje,
    descuento_fijo: j.descuento_fijo,
    fotos: j.fotos,
    stock: j.stock,
    isActive: j.isActive,
    tier: calcularTier(j.precio_final),
  }))

  const consolas = (producto.consolas ?? []).map<ItemFlat>(c => ({
    id: c.id,
    nombre,
    sku,
    tipo: 'consola',
    plataforma: c.generacion ?? '',
    estado: c.estado,
    precio_final: c.precio_final,
    precio_base: c.precio_base,
    descuento_porcentaje: c.descuento_porcentaje,
    descuento_fijo: c.descuento_fijo,
    fotos: c.fotos,
    stock: c.stock,
    isActive: c.isActive,
    tier: calcularTier(c.precio_final),
  }))

  return [...juegos, ...consolas]
}

export function variantesVendibles(variantes: ItemFlat[]): ItemFlat[] {
  return variantes.filter(v => v.isActive && v.stock > 0)
}
