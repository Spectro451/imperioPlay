import type { VentaListado } from '~/composables/api/useVentaApi'

export function formatearFecha(fecha: string): string {
  const d = new Date(fecha)
  return d.toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function textoDescuento(v: VentaListado): string {
  if (v.descuento_porcentaje) return `-${v.descuento_porcentaje}%`
  if (v.descuento_fijo) return `-$${formatearPrecio(v.descuento_fijo)}`
  return '—'
}

export function labelMetodo(m: string): string {
  return { efectivo: 'Efectivo', debito: 'Débito', credito: 'Crédito' }[m] ?? m
}
