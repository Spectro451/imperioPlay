import type { ItemFlat } from './useProductoTypes'
import type { MetodoPago, VentaItemPayload } from './api/useVentaApi'
import type { Usuario } from './api/useUsuarioApi'

export interface LineaVenta {
  variante: ItemFlat
  cantidad: number
}

export type TipoDescuento = 'ninguno' | 'porcentaje' | 'fijo'

export interface ResultadoAgregar {
  ok: boolean
  motivo?: string
}

export function useVentaEnCurso() {
  const lineas = ref<LineaVenta[]>([])
  const tipoDescuento = ref<TipoDescuento>('ninguno')
  const _descuentoValor = ref(0)
  const metodoPago = ref<MetodoPago>('efectivo')
  const montoPagado = ref(0)
  const vendedor = ref<Usuario | null>(null)

  const totalBase = computed(() =>
    lineas.value.reduce((sum, l) => sum + l.variante.precio_final * l.cantidad, 0),
  )

  function clampDescuento(valor: number): number {
    if (!Number.isFinite(valor) || valor < 0) return 0
    if (tipoDescuento.value === 'porcentaje') return Math.min(100, valor)
    if (tipoDescuento.value === 'fijo') return Math.min(totalBase.value, valor)
    return 0
  }

  const descuentoValor = computed({
    get: () => _descuentoValor.value,
    set: (v: number) => { _descuentoValor.value = clampDescuento(v) },
  })

  watch(tipoDescuento, () => {
    _descuentoValor.value = clampDescuento(_descuentoValor.value)
  })

  watch(totalBase, () => {
    if (tipoDescuento.value === 'fijo') {
      _descuentoValor.value = clampDescuento(_descuentoValor.value)
    }
  })

  function keyLinea(v: ItemFlat) {
    return `${v.tipo}-${v.id}`
  }

  function agregarItem(variante: ItemFlat): ResultadoAgregar {
    if (!variante.isActive) {
      return { ok: false, motivo: 'Producto inactivo' }
    }
    if (variante.stock <= 0) {
      return { ok: false, motivo: 'Sin stock disponible' }
    }
    const existente = lineas.value.find(l => keyLinea(l.variante) === keyLinea(variante))
    if (existente) {
      if (existente.cantidad >= variante.stock) {
        return { ok: false, motivo: `Stock máximo alcanzado (${variante.stock})` }
      }
      existente.cantidad += 1
      return { ok: true }
    }
    lineas.value.push({ variante, cantidad: 1 })
    return { ok: true }
  }

  function quitarItem(variante: ItemFlat) {
    lineas.value = lineas.value.filter(l => keyLinea(l.variante) !== keyLinea(variante))
  }

  function cambiarCantidad(variante: ItemFlat, cantidad: number) {
    const linea = lineas.value.find(l => keyLinea(l.variante) === keyLinea(variante))
    if (!linea) return
    linea.cantidad = Math.max(1, Math.min(cantidad, variante.stock))
  }

  function limpiar() {
    lineas.value = []
    tipoDescuento.value = 'ninguno'
    descuentoValor.value = 0
    metodoPago.value = 'efectivo'
    montoPagado.value = 0
    vendedor.value = null
  }

  const totalFinal = computed(() => {
    const base = totalBase.value
    if (tipoDescuento.value === 'porcentaje') {
      return Math.round(base * (1 - descuentoValor.value / 100))
    }
    if (tipoDescuento.value === 'fijo') {
      return base - descuentoValor.value
    }
    return base
  })

  const vuelto = computed(() => Math.max(0, montoPagado.value - totalFinal.value))

  const puedeConfirmar = computed(() =>
    lineas.value.length > 0 &&
    montoPagado.value >= totalFinal.value &&
    totalFinal.value > 0 &&
    vendedor.value !== null,
  )

  const payloadItems = computed<VentaItemPayload[]>(() =>
    lineas.value.map(l => ({
      id: l.variante.id,
      tipo: l.variante.tipo,
      cantidad: l.cantidad,
    })),
  )

  return {
    lineas: readonly(lineas),
    tipoDescuento,
    descuentoValor,
    metodoPago,
    montoPagado,
    vendedor,
    totalBase,
    totalFinal,
    vuelto,
    puedeConfirmar,
    payloadItems,
    agregarItem,
    quitarItem,
    cambiarCantidad,
    limpiar,
  }
}
