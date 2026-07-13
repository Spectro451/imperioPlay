<script setup lang="ts">
import type { VentaListado } from '~/composables/api/useVentaApi'

defineProps<{
  venta: VentaListado
}>()
</script>

<template>
  <div>
    <p class="text-xs uppercase tracking-widest text-muted font-bold mb-3">Ítems vendidos</p>
    <ul class="flex flex-col gap-2">
      <li
        v-for="(item, idx) in venta.items"
        :key="idx"
        class="flex items-center justify-between text-sm border-b border-border/50 last:border-b-0 pb-2 last:pb-0"
      >
        <div class="min-w-0 flex-1">
          <p class="font-bold truncate">{{ item.nombre }}</p>
          <p class="text-xs text-muted capitalize">
            {{ item.tipo }} · {{ item.estado }} · ${{ item.precio_unitario.toLocaleString('es-AR') }} c/u
          </p>
        </div>
        <div class="text-right shrink-0 ml-4">
          <p class="text-xs text-muted">×{{ item.cantidad }}</p>
          <p class="text-sm font-bold">${{ item.subtotal.toLocaleString('es-AR') }}</p>
        </div>
      </li>
    </ul>
    <div class="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs text-muted">
      <span>Pagó: ${{ venta.monto_pagado.toLocaleString('es-AR') }}</span>
      <span v-if="venta.vuelto && venta.vuelto > 0">Vuelto: ${{ venta.vuelto.toLocaleString('es-AR') }}</span>
    </div>
  </div>
</template>
