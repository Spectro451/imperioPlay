import type { ItemFlat } from './useProductoTypes'
import type {
  CreateIntercambioPayload,
  JuegoClientePayload,
  JuegoSolicitadoPayload,
  Plataforma,
  EstadoJuego,
} from './api/useIntercambioApi'
import type { MetodoPago } from './api/useVentaApi'
import type { Usuario } from './api/useUsuarioApi'
import { calcularFaltante, calcularTier } from '~/utils/tiers'

export interface LineaSolicitada {
  variante: ItemFlat
  cantidad: number
}

export interface JuegoClienteInput {
  key: string
  sku: string
  nombre: string
  consola: Plataforma | ''
  estado: EstadoJuego
  precio_base: number
  cantidad: number
  fotos: string[]
}

export interface ResultadoAgregar {
  ok: boolean
  motivo?: string
}

function nuevaKey(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function crearJuegoClienteVacio(): JuegoClienteInput {
  return {
    key: nuevaKey(),
    sku: '',
    nombre: '',
    consola: '',
    estado: 'usado',
    precio_base: 0,
    cantidad: 1,
    fotos: [],
  }
}

export function useIntercambioEnCurso() {
  const lineasSolicitadas = ref<LineaSolicitada[]>([])
  const juegosCliente = ref<JuegoClienteInput[]>([])
  const vendedor = ref<Usuario | null>(null)
  const metodoPago = ref<MetodoPago>('efectivo')
  const montoPagado = ref(0)

  function keyLinea(v: ItemFlat) {
    return `${v.tipo}-${v.id}`
  }

  function agregarSolicitado(variante: ItemFlat): ResultadoAgregar {
    if (variante.tipo !== 'juego') return { ok: false, motivo: 'Solo se permiten juegos' }
    if (!variante.isActive) return { ok: false, motivo: 'Juego inactivo' }
    if (variante.stock <= 0) return { ok: false, motivo: 'Sin stock disponible' }
    const existente = lineasSolicitadas.value.find(l => keyLinea(l.variante) === keyLinea(variante))
    if (existente) {
      if (existente.cantidad >= variante.stock) {
        return { ok: false, motivo: `Stock máximo alcanzado (${variante.stock})` }
      }
      existente.cantidad += 1
      return { ok: true }
    }
    lineasSolicitadas.value.push({ variante, cantidad: 1 })
    return { ok: true }
  }

  function quitarSolicitado(variante: ItemFlat) {
    lineasSolicitadas.value = lineasSolicitadas.value.filter(
      l => keyLinea(l.variante) !== keyLinea(variante),
    )
  }

  function cambiarCantidadSolicitado(variante: ItemFlat, cantidad: number) {
    const linea = lineasSolicitadas.value.find(l => keyLinea(l.variante) === keyLinea(variante))
    if (!linea) return
    linea.cantidad = Math.max(1, Math.min(cantidad, variante.stock))
  }

  function agregarJuegoCliente() {
    juegosCliente.value.push(crearJuegoClienteVacio())
  }

  function quitarJuegoCliente(key: string) {
    juegosCliente.value = juegosCliente.value.filter(j => j.key !== key)
  }

  function cambiarCantidadCliente(key: string, cantidad: number) {
    const j = juegosCliente.value.find(x => x.key === key)
    if (!j) return
    j.cantidad = Math.max(1, Math.floor(cantidad))
  }

  function limpiar() {
    lineasSolicitadas.value = []
    juegosCliente.value = []
    vendedor.value = null
    metodoPago.value = 'efectivo'
    montoPagado.value = 0
  }

  const totalTierSolicitado = computed(() =>
    lineasSolicitadas.value.reduce((sum, l) => sum + l.variante.tier * l.cantidad, 0),
  )

  const totalTierCliente = computed(() =>
    juegosCliente.value.reduce((sum, j) => sum + calcularTier(j.precio_base) * j.cantidad, 0),
  )

  const faltante = computed(() =>
    calcularFaltante(totalTierSolicitado.value, totalTierCliente.value),
  )

  const dineroExtra = computed(() => faltante.value.dineroExtra)

  const vuelto = computed(() =>
    dineroExtra.value > 0 ? Math.max(0, montoPagado.value - dineroExtra.value) : 0,
  )

  const juegosClienteValidos = computed(() =>
    juegosCliente.value.every(j =>
      j.sku.trim().length > 0
      && j.nombre.trim().length > 0
      && j.consola !== ''
      && j.precio_base > 0
      && j.cantidad > 0,
    ),
  )

  const puedeConfirmar = computed(() => {
    if (!vendedor.value) return false
    if (lineasSolicitadas.value.length === 0) return false
    if (juegosCliente.value.length === 0) return false
    if (!juegosClienteValidos.value) return false
    if (dineroExtra.value > 0 && montoPagado.value < dineroExtra.value) return false
    return true
  })

  const payload = computed<CreateIntercambioPayload>(() => {
    const solicitados: JuegoSolicitadoPayload[] = lineasSolicitadas.value.map(l => ({
      juegoId: l.variante.id,
      cantidad: l.cantidad,
    }))
    const cliente: JuegoClientePayload[] = juegosCliente.value.map(j => ({
      producto: { nombre: j.nombre.trim(), tipo: 'juego', sku: j.sku.trim() },
      consola: j.consola as Plataforma,
      estado: j.estado,
      cantidad: j.cantidad,
      fotos: j.fotos,
      precio_base: j.precio_base,
    }))
    return {
      juegosSolicitadosData: solicitados,
      juegosClienteData: cliente,
      vendedor_id: vendedor.value?.id,
      monto_pagado: dineroExtra.value > 0 ? montoPagado.value : undefined,
      metodo_pago: dineroExtra.value > 0 ? metodoPago.value : undefined,
    }
  })

  return {
    lineasSolicitadas: readonly(lineasSolicitadas),
    juegosCliente,
    vendedor,
    metodoPago,
    montoPagado,
    totalTierSolicitado,
    totalTierCliente,
    faltante,
    dineroExtra,
    vuelto,
    puedeConfirmar,
    payload,
    agregarSolicitado,
    quitarSolicitado,
    cambiarCantidadSolicitado,
    agregarJuegoCliente,
    quitarJuegoCliente,
    cambiarCantidadCliente,
    limpiar,
  }
}
