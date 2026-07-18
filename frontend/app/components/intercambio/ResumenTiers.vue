<script setup lang="ts">
import type { MetodoPago } from '~/composables/api/useVentaApi'

const props = defineProps<{
  totalTierSolicitado: number
  totalTierCliente: number
  faltanteTier: number
  dineroExtra: number
  cumple: boolean
  metodoPago: MetodoPago
  montoPagado: number
  vuelto: number
  puedeConfirmar: boolean
  procesando: boolean
}>()

const emit = defineEmits<{
  (e: 'update:metodoPago', v: MetodoPago): void
  (e: 'update:montoPagado', v: number): void
  (e: 'confirmar'): void
  (e: 'cancelar'): void
}>()

const metodoPagoLocal = computed({
  get: () => props.metodoPago,
  set: v => emit('update:metodoPago', v),
})

const montoPagadoLocal = computed({
  get: () => props.montoPagado,
  set: v => emit('update:montoPagado', v),
})
</script>

<template>
  <div class="bg-bg-card border border-border rounded-lg p-5 flex flex-col gap-5">
    <div class="flex flex-col gap-2">
      <div class="flex justify-between text-sm">
        <span class="text-muted">Tier solicitado</span>
        <span class="font-bold">{{ totalTierSolicitado }}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-muted">Tier del cliente</span>
        <span class="font-bold">{{ totalTierCliente }}</span>
      </div>
      <div class="flex justify-between text-sm border-t border-border pt-2">
        <span class="text-muted">Faltante</span>
        <span class="font-bold" :class="cumple ? 'text-acento-1' : 'text-warning'">
          {{ cumple ? 'Cubre la cuota' : `${faltanteTier} tier` }}
        </span>
      </div>
    </div>

    <div v-if="dineroExtra > 0" class="flex flex-col gap-4 border-t border-border pt-4">
      <div class="flex justify-between text-sm">
        <span class="text-muted">Debe pagar</span>
        <span class="text-lg font-bold text-warning">${{ dineroExtra.toLocaleString('es-AR') }}</span>
      </div>

      <div>
        <p class="text-xs uppercase tracking-widest text-muted font-bold mb-2">Método de pago</p>
        <div class="flex gap-2">
          <button
            type="button"
            class="flex-1 px-3 py-2 text-xs font-bold rounded border transition-colors"
            :class="metodoPagoLocal === 'efectivo' ? 'border-acento-1 text-acento-1' : 'border-border text-muted hover:text-fg'"
            @click="metodoPagoLocal = 'efectivo'"
          >
            Efectivo
          </button>
          <button
            type="button"
            class="flex-1 px-3 py-2 text-xs font-bold rounded border transition-colors"
            :class="metodoPagoLocal === 'debito' ? 'border-acento-1 text-acento-1' : 'border-border text-muted hover:text-fg'"
            @click="metodoPagoLocal = 'debito'"
          >
            Débito
          </button>
          <button
            type="button"
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
        <InputNumero v-model="montoPagadoLocal" :min="0" placeholder="0" />
        <div class="flex gap-2 mt-2">
          <button
            type="button"
            class="flex-1 px-3 py-2 text-xs font-bold rounded border border-acento-1 text-acento-1 hover:bg-acento-1 hover:text-bg-hard transition-colors"
            @click="montoPagadoLocal = dineroExtra"
          >
            Monto exacto
          </button>
        </div>
      </div>

      <div class="flex justify-between text-sm border-t border-border pt-3">
        <span class="text-muted">Vuelto</span>
        <span class="font-bold" :class="vuelto > 0 ? 'text-fg' : 'text-muted'">
          ${{ vuelto.toLocaleString('es-AR') }}
        </span>
      </div>
    </div>

    <div class="flex flex-col gap-2 border-t border-border pt-4">
      <button
        type="button"
        class="w-full px-4 py-3 text-sm font-bold bg-acento-1 text-bg-hard rounded hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
        :disabled="!puedeConfirmar || procesando"
        @click="emit('confirmar')"
      >
        {{ procesando ? 'Procesando…' : 'Confirmar intercambio' }}
      </button>
      <button
        type="button"
        class="w-full px-4 py-2 text-xs text-muted hover:text-danger transition-colors"
        :disabled="procesando"
        @click="emit('cancelar')"
      >
        Cancelar intercambio
      </button>
    </div>
  </div>
</template>
