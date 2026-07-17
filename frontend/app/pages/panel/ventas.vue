<script setup lang="ts">
import type { ItemFlat } from '~/composables/useProductoTypes'

definePageMeta({ middleware: 'panel', layout: 'panel' })

const {
  lineas,
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
} = useVentaEnCurso()

const { create } = useVentaApi()
const { notificar } = useNotify()

const variantesModal = ref<ItemFlat[] | null>(null)
const procesando = ref(false)

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
      vendedor_id: vendedor.value?.id,
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

    <div class="mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">
      <div class="md:col-span-1">
        <SelectorVendedor
          v-model:vendedor="vendedor"
          @error="(m) => notificar('error', m)"
        />
      </div>
      <div class="md:col-span-2">
        <BuscadorVenta
          @seleccionar="onSeleccionarBuscador"
          @multiples="onMultiplesVariantes"
          @error="(m) => notificar('error', m)"
        />
      </div>
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
