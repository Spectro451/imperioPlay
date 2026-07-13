<script setup lang="ts">
import type { MetodoPago } from '~/composables/api/useVentaApi'
import type { TipoDescuento } from '~/composables/useVentaEnCurso'

const props = defineProps<{
  totalBase: number
  totalFinal: number
  vuelto: number
  puedeConfirmar: boolean
  procesando: boolean
  tipoDescuento: TipoDescuento
  descuentoValor: number
  metodoPago: MetodoPago
  montoPagado: number
}>()

const emit = defineEmits<{
  (e: 'update:tipoDescuento', v: TipoDescuento): void
  (e: 'update:descuentoValor', v: number): void
  (e: 'update:metodoPago', v: MetodoPago): void
  (e: 'update:montoPagado', v: number): void
  (e: 'confirmar'): void
  (e: 'cancelar'): void
}>()

const tipoDescuentoLocal = computed({
  get: () => props.tipoDescuento,
  set: (v) => {
    emit('update:tipoDescuento', v)
    if (v === 'ninguno') emit('update:descuentoValor', 0)
  },
})

const descuentoValorLocal = computed({
  get: () => props.descuentoValor,
  set: (v) => emit('update:descuentoValor', v),
})

const metodoPagoLocal = computed({
  get: () => props.metodoPago,
  set: (v) => emit('update:metodoPago', v),
})

const montoPagadoLocal = computed({
  get: () => props.montoPagado,
  set: (v) => emit('update:montoPagado', v),
})

const ahorro = computed(() => props.totalBase - props.totalFinal)
</script>

<template>
  <div class="bg-bg-card border border-border rounded-lg p-5 flex flex-col gap-5">
    <div>
      <p class="text-xs uppercase tracking-widest text-muted font-bold mb-2">Descuento</p>
      <div class="flex gap-2 mb-3">
        <button
          class="flex-1 px-3 py-2 text-xs font-bold rounded border transition-colors"
          :class="tipoDescuentoLocal === 'ninguno' ? 'border-acento-1 text-acento-1' : 'border-border text-muted hover:text-fg'"
          @click="tipoDescuentoLocal = 'ninguno'"
        >
          Ninguno
        </button>
        <button
          class="flex-1 px-3 py-2 text-xs font-bold rounded border transition-colors"
          :class="tipoDescuentoLocal === 'porcentaje' ? 'border-acento-1 text-acento-1' : 'border-border text-muted hover:text-fg'"
          @click="tipoDescuentoLocal = 'porcentaje'"
        >
          %
        </button>
        <button
          class="flex-1 px-3 py-2 text-xs font-bold rounded border transition-colors"
          :class="tipoDescuentoLocal === 'fijo' ? 'border-acento-1 text-acento-1' : 'border-border text-muted hover:text-fg'"
          @click="tipoDescuentoLocal = 'fijo'"
        >
          Fijo $
        </button>
      </div>
      <InputNumero
        v-if="tipoDescuentoLocal !== 'ninguno'"
        v-model="descuentoValorLocal"
        :min="0"
        :max="tipoDescuentoLocal === 'porcentaje' ? 100 : totalBase"
        :placeholder="tipoDescuentoLocal === 'porcentaje' ? '0-100' : 'Monto en $'"
      />
    </div>

    <div>
      <p class="text-xs uppercase tracking-widest text-muted font-bold mb-2">Método de pago</p>
      <div class="flex gap-2">
        <button
          class="flex-1 px-3 py-2 text-xs font-bold rounded border transition-colors"
          :class="metodoPagoLocal === 'efectivo' ? 'border-acento-1 text-acento-1' : 'border-border text-muted hover:text-fg'"
          @click="metodoPagoLocal = 'efectivo'"
        >
          Efectivo
        </button>
        <button
          class="flex-1 px-3 py-2 text-xs font-bold rounded border transition-colors"
          :class="metodoPagoLocal === 'debito' ? 'border-acento-1 text-acento-1' : 'border-border text-muted hover:text-fg'"
          @click="metodoPagoLocal = 'debito'"
        >
          Débito
        </button>
        <button
          class="flex-1 px-3 py-2 text-xs font-bold rounded border transition-colors"
          :class="metodoPagoLocal === 'credito' ? 'border-acento-1 text-acento-1' : 'border-border text-muted hover:text-fg'"
          @click="metodoPagoLocal = 'credito'"
        >
          Crédito
        </button>
      </div>
    </div>

    <div>
      <p class="text-xs uppercase tracking-widest text-muted font-bold mb-2">Monto pagado</p>
      <InputNumero
        v-model="montoPagadoLocal"
        :min="0"
        placeholder="0"
      />
      <div class="flex gap-2 mt-2">
        <button
          class="flex-1 px-3 py-2 text-xs font-bold rounded border border-acento-1 text-acento-1 hover:bg-acento-1 hover:text-bg-hard transition-colors"
          @click="montoPagadoLocal = totalFinal"
        >
          Monto exacto
        </button>
      </div>
    </div>

    <div class="border-t border-border pt-4 flex flex-col gap-1 text-sm">
      <div class="flex justify-between text-muted">
        <span>Subtotal</span>
        <span>${{ totalBase.toLocaleString('es-AR') }}</span>
      </div>
      <div v-if="ahorro > 0" class="flex justify-between text-muted">
        <span>Descuento</span>
        <span>−${{ ahorro.toLocaleString('es-AR') }}</span>
      </div>
      <div class="flex justify-between font-bold text-base pt-1">
        <span>Total</span>
        <span class="text-acento-1">${{ totalFinal.toLocaleString('es-AR') }}</span>
      </div>
      <div class="flex justify-between text-sm pt-1 border-t border-border mt-2">
        <span class="text-muted">Vuelto</span>
        <span class="font-bold" :class="vuelto > 0 ? 'text-fg' : 'text-muted'">
          ${{ vuelto.toLocaleString('es-AR') }}
        </span>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <button
        class="w-full px-4 py-3 text-sm font-bold bg-acento-1 text-bg-hard rounded hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
        :disabled="!puedeConfirmar || procesando"
        @click="emit('confirmar')"
      >
        {{ procesando ? 'Procesando…' : 'Confirmar venta' }}
      </button>
      <button
        class="w-full px-4 py-2 text-xs text-muted hover:text-danger transition-colors"
        :disabled="procesando"
        @click="emit('cancelar')"
      >
        Cancelar venta
      </button>
    </div>
  </div>
</template>
