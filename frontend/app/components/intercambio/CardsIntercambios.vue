<script setup lang="ts">
import type { IntercambioListado } from '~/composables/api/useIntercambioApi'

defineProps<{
  intercambios: IntercambioListado[]
  pending: boolean
}>()

const expandida = ref<number | null>(null)

function toggle(id: number) {
  expandida.value = expandida.value === id ? null : id
}
</script>

<template>
  <PanelCards :rows="intercambios" :pending="pending" empty-text="Sin intercambios para estos filtros.">
    <template #skeleton>
      <SkeletonIntercambiosCards />
    </template>
    <template #card="{ row: i }">
      <div class="bg-bg-card border border-border rounded-lg overflow-hidden">
        <div
          class="p-4 flex items-start justify-between gap-3 cursor-pointer"
          @click="toggle(i.id)"
        >
          <div class="min-w-0 flex-1">
            <p class="text-sm font-bold"><FechaVenta :iso="i.fecha" /></p>
            <p class="text-xs text-muted mt-1">
              {{ i.vendedor.nombre }}<span v-if="i.metodo_pago"> · {{ labelMetodo(i.metodo_pago) }}</span>
            </p>
          </div>
          <div class="text-right shrink-0">
            <p class="text-sm font-bold" :class="i.dinero_extra ? 'text-acento-1' : 'text-muted'">
              {{ i.dinero_extra ? `$${formatearPrecio(i.dinero_extra)}` : '—' }}
            </p>
            <p class="text-muted text-xs mt-1">{{ expandida === i.id ? '▾' : '▸' }}</p>
          </div>
        </div>
        <div v-if="expandida === i.id" class="border-t border-border bg-bg-hard/30 p-4">
          <DetalleIntercambio :intercambio="i" />
        </div>
      </div>
    </template>
  </PanelCards>
</template>
