<script setup lang="ts">
import type { VentaListado } from '~/composables/api/useVentaApi'

export type SortCol = 'fecha' | 'total'
export type SortDir = 'asc' | 'desc'

defineProps<{
  ventas: VentaListado[]
  pending: boolean
  sortCol: SortCol
  sortDir: SortDir
}>()

const emit = defineEmits<{
  (e: 'toggle-sort', col: SortCol): void
}>()

const expandida = ref<number | null>(null)

function toggle(id: number) {
  expandida.value = expandida.value === id ? null : id
}

function flecha(col: SortCol, currentCol: SortCol, dir: SortDir): string {
  if (col !== currentCol) return '↕'
  return dir === 'asc' ? '▲' : '▼'
}
</script>

<template>
  <div class="bg-bg-card border border-border rounded-lg overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-sm table-fixed">
        <colgroup>
          <col class="w-10" />
          <col class="w-48" />
          <col />
          <col class="w-32" />
          <col class="w-32" />
          <col class="w-32" />
        </colgroup>
        <thead class="bg-bg-hard border-b border-border">
          <tr class="text-left text-xs uppercase tracking-widest text-muted">
            <th class="px-4 py-3 font-bold"></th>
            <th class="px-4 py-3 font-bold">
              <button
                class="inline-flex items-center gap-1 text-xs uppercase tracking-widest font-bold text-muted hover:text-fg transition-colors"
                :class="sortCol === 'fecha' && 'text-fg'"
                @click="emit('toggle-sort', 'fecha')"
              >
                Fecha
                <span class="text-[10px]">{{ flecha('fecha', sortCol, sortDir) }}</span>
              </button>
            </th>
            <th class="px-4 py-3 font-bold">Vendedor</th>
            <th class="px-4 py-3 font-bold">Método</th>
            <th class="px-4 py-3 font-bold text-right">Descuento</th>
            <th class="px-4 py-3 font-bold text-right">
              <button
                class="inline-flex items-center gap-1 text-xs uppercase tracking-widest font-bold text-muted hover:text-fg transition-colors"
                :class="sortCol === 'total' && 'text-fg'"
                @click="emit('toggle-sort', 'total')"
              >
                Total
                <span class="text-[10px]">{{ flecha('total', sortCol, sortDir) }}</span>
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-if="pending">
            <SkeletonVentasFilas />
          </template>
          <template v-else-if="!ventas.length">
            <tr>
              <td colspan="6" class="px-4 py-16 text-center text-muted">Sin ventas para estos filtros.</td>
            </tr>
          </template>
          <template v-else>
            <template v-for="v in ventas" :key="v.id">
              <tr
                class="border-b border-border hover:bg-bg-hard/50 transition-colors cursor-pointer"
                @click="toggle(v.id)"
              >
                <td class="px-4 py-3 text-muted">
                  {{ expandida === v.id ? '▾' : '▸' }}
                </td>
                <td class="px-4 py-3"><FechaVenta :iso="v.fecha" /></td>
                <td class="px-4 py-3">{{ v.vendedor.nombre }}</td>
                <td class="px-4 py-3">{{ labelMetodo(v.metodo_pago) }}</td>
                <td class="px-4 py-3 text-right text-muted text-xs">{{ textoDescuento(v) }}</td>
                <td class="px-4 py-3 text-right font-bold text-acento-1">
                  ${{ formatearPrecio(v.total) }}
                </td>
              </tr>
              <tr v-if="expandida === v.id" class="bg-bg-hard/30 border-b border-border">
                <td colspan="6" class="px-6 py-4">
                  <DetalleVenta :venta="v" />
                </td>
              </tr>
            </template>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>
