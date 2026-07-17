<script setup lang="ts">
import type { ItemFlat } from '~/composables/useProductoTypes'
import type { PanelTablaColumn } from './PanelTabla.vue'

export type SortCol = 'id' | 'nombre' | 'stock' | 'precio'
export type SortDir = 'asc' | 'desc'

defineProps<{
  items: ItemFlat[]
  pending: boolean
  sortCol: SortCol
  sortDir: SortDir
}>()

const emit = defineEmits<{
  (e: 'toggle-sort', col: SortCol): void
  (e: 'editar', item: ItemFlat): void
  (e: 'eliminar', item: ItemFlat): void
  (e: 'reactivar', item: ItemFlat): void
}>()

const columns: PanelTablaColumn[] = [
  { key: 'nombre', label: 'Nombre', sortable: true },
  { key: 'sku', label: 'SKU' },
  { key: 'tipo', label: 'Tipo' },
  { key: 'plataforma', label: 'Plataforma' },
  { key: 'estado', label: 'Estado' },
  { key: 'stock', label: 'Stock', sortable: true, align: 'right' },
  { key: 'precio', label: 'Precio', sortable: true, align: 'right' },
  { key: 'acciones', label: 'Acciones', align: 'right' },
]
</script>

<template>
  <PanelTabla
    :columns="columns"
    :rows="items"
    :pending="pending"
    :sort-col="sortCol"
    :sort-dir="sortDir"
    @toggle-sort="(c) => emit('toggle-sort', c as SortCol)"
  >
    <template #skeleton>
      <SkeletonProductosFilas />
    </template>
    <template #row="{ row: item }">
      <tr
        class="border-b border-border last:border-b-0 hover:bg-bg-hard/50 transition-colors"
        :class="!item.isActive && 'opacity-50'"
      >
        <td class="px-4 py-3 font-medium">{{ item.nombre }}</td>
        <td class="px-4 py-3 text-muted font-mono text-xs">{{ item.sku || '—' }}</td>
        <td class="px-4 py-3 capitalize text-muted">{{ item.tipo }}</td>
        <td class="px-4 py-3">{{ item.plataforma }}</td>
        <td class="px-4 py-3 capitalize">{{ item.estado }}</td>
        <td class="px-4 py-3 text-right font-bold" :class="stockClass(item.stock)">{{ item.stock }}</td>
        <td class="px-4 py-3 text-right">
          <div class="flex flex-col items-end leading-tight">
            <span
              v-if="tieneOferta(item)"
              class="text-xs text-muted line-through"
            >
              ${{ formatearPrecio(item.precio_base) }}
            </span>
            <span class="font-bold text-acento-1">
              ${{ formatearPrecio(item.precio_final) }}
            </span>
            <span
              v-if="tieneOferta(item)"
              class="text-[10px] font-bold text-muted uppercase tracking-wider"
            >
              {{ textoDescuentoProducto(item) }}
            </span>
          </div>
        </td>
        <td class="px-4 py-3 text-right">
          <div class="flex gap-2 justify-end">
            <button
              class="text-xs text-muted hover:text-acento-1 transition-colors"
              @click="emit('editar', item)"
            >
              Editar
            </button>
            <button
              v-if="item.isActive"
              class="text-xs text-muted hover:text-red-500 transition-colors"
              @click="emit('eliminar', item)"
            >
              Eliminar
            </button>
            <button
              v-else
              class="text-xs text-muted hover:text-acento-1 transition-colors"
              @click="emit('reactivar', item)"
            >
              Reactivar
            </button>
          </div>
        </td>
      </tr>
    </template>
  </PanelTabla>
</template>
