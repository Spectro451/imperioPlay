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
  <div class="flex flex-col gap-3">
    <template v-if="pending">
      <div
        v-for="n in 6"
        :key="n"
        class="bg-bg-card border border-border rounded-lg p-4 animate-pulse flex flex-col gap-2"
      >
        <div class="h-3 w-32 bg-bg-soft rounded" />
        <div class="h-3 w-24 bg-bg-soft rounded" />
        <div class="h-4 w-20 bg-bg-soft rounded ml-auto" />
      </div>
    </template>
    <template v-else-if="!ventas.length">
      <p class="bg-bg-card border border-border rounded-lg p-6 text-center text-muted text-sm">
        Sin ventas para estos filtros.
      </p>
    </template>
    <template v-else>
      <div
        v-for="v in ventas"
        :key="`card-${v.id}`"
        class="bg-bg-card border border-border rounded-lg overflow-hidden"
      >
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
  </div>
</template>
