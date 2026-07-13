<script setup lang="ts">
import type { ItemFlat } from '~/composables/useProductoTypes'

definePageMeta({ middleware: 'panel', layout: 'panel' })

const {
  lineas,
  tipoDescuento,
  descuentoValor,
  metodoPago,
  montoPagado,
  totalBase,
  totalFinal,
  vuelto,
  puedeConfirmar,
  payloadItems,
  agregarItem,
  quitarItem,
  cambiarCantidad,
  limpiar,
} = useVentaEnCurso()

const { create } = useVentaApi()

const variantesModal = ref<ItemFlat[] | null>(null)
const procesando = ref(false)
const mensaje = ref<{ tipo: 'error' | 'ok'; texto: string } | null>(null)
let mensajeTimer: ReturnType<typeof setTimeout> | null = null

function notificar(tipo: 'error' | 'ok', texto: string) {
  if (mensajeTimer) clearTimeout(mensajeTimer)
  mensaje.value = { tipo, texto }
  mensajeTimer = setTimeout(() => { mensaje.value = null }, 3500)
}

function agregar(variante: ItemFlat) {
  const res = agregarItem(variante)
  if (!res.ok) notificar('error', res.motivo ?? 'No se pudo agregar')
}

function onSeleccionarBuscador(variante: ItemFlat) {
  agregar(variante)
}

function onMultiplesVariantes(variantes: ItemFlat[]) {
  variantesModal.value = variantes
}

function onSeleccionarModal(variante: ItemFlat) {
  agregar(variante)
  variantesModal.value = null
}

async function confirmar() {
  procesando.value = true
  try {
    await create({
      metodo_pago: metodoPago.value,
      monto_pagado: montoPagado.value,
      descuento_porcentaje: tipoDescuento.value === 'porcentaje' ? descuentoValor.value : undefined,
      descuento_fijo: tipoDescuento.value === 'fijo' ? descuentoValor.value : undefined,
      items: payloadItems.value,
    })
    notificar('ok', 'Venta registrada')
    limpiar()
  } catch (e: any) {
    notificar('error', e?.data?.message ?? 'Error al registrar la venta')
  } finally {
    procesando.value = false
  }
}

function cancelar() {
  if (!lineas.value.length) return
  if (!confirm('Cancelar la venta en curso y limpiar los items?')) return
  limpiar()
}
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-black tracking-tight mb-1">Registrar venta</h1>
      <p class="text-muted text-sm">Escaneá un SKU o buscá por nombre para armar la venta.</p>
    </div>

    <div class="mb-6">
      <BuscadorVenta
        @seleccionar="onSeleccionarBuscador"
        @multiples="onMultiplesVariantes"
        @error="(m) => notificar('error', m)"
      />
    </div>

    <div
      v-if="mensaje"
      class="mb-4 px-4 py-2 rounded border text-sm"
      :class="mensaje.tipo === 'error'
        ? 'border-danger text-danger bg-danger/10'
        : 'border-acento-1 text-acento-1 bg-acento-1/10'"
    >
      {{ mensaje.texto }}
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <LineasVenta
          :lineas="lineas"
          @cambiar-cantidad="cambiarCantidad"
          @quitar="quitarItem"
        />
      </div>

      <div class="lg:col-span-1">
        <ResumenPago
          :total-base="totalBase"
          :total-final="totalFinal"
          :vuelto="vuelto"
          :puede-confirmar="puedeConfirmar"
          :procesando="procesando"
          v-model:tipo-descuento="tipoDescuento"
          v-model:descuento-valor="descuentoValor"
          v-model:metodo-pago="metodoPago"
          v-model:monto-pagado="montoPagado"
          @confirmar="confirmar"
          @cancelar="cancelar"
        />
      </div>
    </div>

    <ModalVariantes
      v-if="variantesModal"
      :variantes="variantesModal"
      @seleccionar="onSeleccionarModal"
      @cerrar="variantesModal = null"
    />
  </div>
</template>
