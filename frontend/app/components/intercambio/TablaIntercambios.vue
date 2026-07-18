<script setup lang="ts">
import type { IntercambioListado } from '~/composables/api/useIntercambioApi'
import type { PanelTablaColumn } from '~/components/panel/PanelTabla.vue'

export type SortCol = 'fecha' | 'dinero'
export type SortDir = 'asc' | 'desc'

defineProps<{
  intercambios: IntercambioListado[]
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
  { key: 'dinero', label: 'Dinero extra', sortable: true, align: 'right' },
]
</script>

<template>
  <PanelTabla
    :columns="columns"
    :rows="intercambios"
    :pending="pending"
    :sort-col="sortCol"
    :sort-dir="sortDir"
    empty-text="Sin intercambios para estos filtros."
    @toggle-sort="(c) => emit('toggle-sort', c as SortCol)"
  >
    <template #colgroup>
      <colgroup>
        <col class="w-10" />
        <col class="w-48" />
        <col />
        <col class="w-32" />
        <col class="w-40" />
      </colgroup>
    </template>
    <template #skeleton>
      <SkeletonIntercambiosFilas />
    </template>
    <template #row="{ row: i }">
      <tr
        class="border-b border-border hover:bg-bg-hard/50 transition-colors cursor-pointer"
        @click="toggle(i.id)"
      >
        <td class="px-4 py-3 text-muted">{{ expandida === i.id ? '▾' : '▸' }}</td>
        <td class="px-4 py-3"><FechaVenta :iso="i.fecha" /></td>
        <td class="px-4 py-3">{{ i.vendedor.nombre }}</td>
        <td class="px-4 py-3">{{ i.metodo_pago ? labelMetodo(i.metodo_pago) : '—' }}</td>
        <td class="px-4 py-3 text-right font-bold" :class="i.dinero_extra ? 'text-acento-1' : 'text-muted'">
          {{ i.dinero_extra ? `$${formatearPrecio(i.dinero_extra)}` : '—' }}
        </td>
      </tr>
      <tr v-if="expandida === i.id" class="bg-bg-hard/30 border-b border-border">
        <td colspan="5" class="px-6 py-4">
          <DetalleIntercambio :intercambio="i" />
        </td>
      </tr>
    </template>
  </PanelTabla>
</template>
