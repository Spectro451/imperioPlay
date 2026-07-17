<script setup lang="ts">
import type { VentaListado } from '~/composables/api/useVentaApi'

defineProps<{
  ventas: VentaListado[]
  pending: boolean
}>()

const expandida = ref<number | null>(null)

function toggle(id: number) {
  expandida.value = expandida.value === id ? null : id
}
</script>

<template>
  <PanelCards :rows="ventas" :pending="pending" empty-text="Sin ventas para estos filtros.">
    <template #skeleton>
      <SkeletonVentasCards />
    </template>
    <template #card="{ row: v }">
      <div class="bg-bg-card border border-border rounded-lg overflow-hidden">
        <div
          class="p-4 flex items-start justify-between gap-3 cursor-pointer"
          @click="toggle(v.id)"
        >
          <div class="min-w-0 flex-1">
            <p class="text-sm font-bold"><FechaVenta :iso="v.fecha" /></p>
            <p class="text-xs text-muted mt-1">
              {{ v.vendedor.nombre }} · {{ labelMetodo(v.metodo_pago) }}
            </p>
            <p v-if="textoDescuento(v) !== '—'" class="text-[10px] text-muted mt-0.5">
              Descuento: {{ textoDescuento(v) }}
            </p>
          </div>
          <div class="text-right shrink-0">
            <p class="text-sm font-bold text-acento-1">${{ formatearPrecio(v.total) }}</p>
            <p class="text-muted text-xs mt-1">{{ expandida === v.id ? '▾' : '▸' }}</p>
          </div>
        </div>
        <div v-if="expandida === v.id" class="border-t border-border bg-bg-hard/30 p-4">
          <DetalleVenta :venta="v" />
        </div>
      </div>
    </template>
  </PanelCards>
</template>
