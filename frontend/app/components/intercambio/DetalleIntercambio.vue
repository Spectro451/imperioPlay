<script setup lang="ts">
import type { IntercambioListado } from '~/composables/api/useIntercambioApi'

const props = defineProps<{
  intercambio: IntercambioListado
}>()

const solicitados = computed(() => props.intercambio.items.filter(i => i.rol === 'solicitado'))
const entregados = computed(() => props.intercambio.items.filter(i => i.rol === 'entregado'))

function tierTotal(items: typeof solicitados.value): number {
  return items.reduce((sum, i) => sum + i.tier * i.cantidad, 0)
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <p class="text-xs uppercase tracking-widest text-muted font-bold mb-2">
          Se llevó · tier {{ tierTotal(solicitados) }}
        </p>
        <ul class="flex flex-col gap-2">
          <li
            v-for="(item, i) in solicitados"
            :key="`sol-${i}`"
            class="flex items-center justify-between text-sm border-b border-border/50 last:border-b-0 pb-2 last:pb-0"
          >
            <div class="min-w-0 flex-1">
              <p class="font-bold truncate">{{ item.nombre }}</p>
              <p class="text-xs text-muted capitalize">
                {{ item.consola }} · {{ item.estado }}
              </p>
              <p v-if="item.sku" class="text-xs text-muted mt-0.5 font-mono">SKU: {{ item.sku }}</p>
            </div>
            <div class="text-right shrink-0 ml-4">
              <p class="text-xs text-muted">×{{ item.cantidad }}</p>
              <p class="text-sm font-bold text-acento-1">Tier {{ item.tier }}</p>
            </div>
          </li>
        </ul>
      </div>

      <div>
        <p class="text-xs uppercase tracking-widest text-muted font-bold mb-2">
          Trajo · tier {{ tierTotal(entregados) }}
        </p>
        <ul class="flex flex-col gap-2">
          <li
            v-for="(item, i) in entregados"
            :key="`ent-${i}`"
            class="flex items-center justify-between text-sm border-b border-border/50 last:border-b-0 pb-2 last:pb-0"
          >
            <div class="min-w-0 flex-1">
              <p class="font-bold truncate">{{ item.nombre }}</p>
              <p class="text-xs text-muted capitalize">
                {{ item.consola }} · {{ item.estado }}
              </p>
              <p v-if="item.sku" class="text-xs text-muted mt-0.5 font-mono">SKU: {{ item.sku }}</p>
            </div>
            <div class="text-right shrink-0 ml-4">
              <p class="text-xs text-muted">×{{ item.cantidad }}</p>
              <p class="text-sm font-bold text-acento-1">Tier {{ item.tier }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div
      v-if="intercambio.dinero_extra && intercambio.dinero_extra > 0"
      class="pt-3 border-t border-border flex items-center justify-between text-xs text-muted"
    >
      <span>
        Debía: ${{ intercambio.dinero_extra.toLocaleString('es-AR') }} ·
        Pagó: ${{ (intercambio.monto_pagado ?? 0).toLocaleString('es-AR') }}
      </span>
      <span v-if="intercambio.vuelto && intercambio.vuelto > 0">
        Vuelto: ${{ intercambio.vuelto.toLocaleString('es-AR') }}
      </span>
    </div>
  </div>
</template>
