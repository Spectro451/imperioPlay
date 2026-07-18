import type { VentaListado } from '~/composables/api/useVentaApi'

export function textoDescuento(v: VentaListado): string {
  if (v.descuento_porcentaje) return `-${v.descuento_porcentaje}%`
  if (v.descuento_fijo) return `-$${formatearPrecio(v.descuento_fijo)}`
  return '—'
}

export function labelMetodo(m: string): string {
  return { efectivo: 'Efectivo', debito: 'Débito', credito: 'Crédito' }[m] ?? m
}
