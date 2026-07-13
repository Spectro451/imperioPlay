import type { ItemFlat } from '~/composables/useProductoTypes'

export function tieneOferta(item: ItemFlat): boolean {
  return (item.descuento_porcentaje ?? 0) > 0 || (item.descuento_fijo ?? 0) > 0
}

export function stockClass(stock: number): string {
  if (stock <= 1) return 'text-danger'
  if (stock <= 5) return 'text-warning'
  return ''
}

export function textoDescuentoProducto(item: ItemFlat): string {
  if (item.descuento_porcentaje) return `-${item.descuento_porcentaje}%`
  if (item.descuento_fijo) return `-$${formatearPrecio(item.descuento_fijo)}`
  return ''
}
