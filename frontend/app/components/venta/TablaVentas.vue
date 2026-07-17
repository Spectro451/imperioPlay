<script setup lang="ts">
import type { VentaListado } from '~/composables/api/useVentaApi'
import type { PanelTablaColumn } from '~/components/panel/PanelTabla.vue'

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

const columns: PanelTablaColumn[] = [
  { key: '_expand', label: '' },
  { key: 'fecha', label: 'Fecha', sortable: true },
  { key: 'vendedor', label: 'Vendedor' },
  { key: 'metodo', label: 'Método' },
  { key: 'descuento', label: 'Descuento', align: 'right' },
  { key: 'total', label: 'Total', sortable: true, align: 'right' },
]
</script>

<template>
  <PanelTabla
    :columns="columns"
    :rows="ventas"
    :pending="pending"
    :sort-col="sortCol"
    :sort-dir="sortDir"
    empty-text="Sin ventas para estos filtros."
    @toggle-sort="(c) => emit('toggle-sort', c as SortCol)"
  >
    <template #colgroup>
      <colgroup>
        <col class="w-10" />
        <col class="w-48" />
        <col />
        <col class="w-32" />
        <col class="w-32" />
        <col class="w-32" />
      </colgroup>
    </template>
    <template #skeleton>
      <SkeletonVentasFilas />
    </template>
    <template #row="{ row: v }">
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
  </PanelTabla>
</template>
