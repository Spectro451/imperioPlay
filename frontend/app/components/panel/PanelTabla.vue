<script setup lang="ts" generic="T extends { id: number | string }">
export type PanelTablaColumn = {
  key: string
  label: string
  sortable?: boolean
  align?: 'left' | 'right'
}

const props = defineProps<{
  columns: PanelTablaColumn[]
  rows: T[]
  pending: boolean
  sortCol?: string
  sortDir?: 'asc' | 'desc'
  emptyText?: string
}>()

const emit = defineEmits<{
  (e: 'toggle-sort', col: string): void
}>()

defineSlots<{
  colgroup(): any
  skeleton(): any
  row(p: { row: T }): any
}>()

function flecha(col: string): string {
  if (!props.sortCol || col !== props.sortCol) return '↕'
  return props.sortDir === 'asc' ? '▲' : '▼'
}
</script>

<template>
  <div class="bg-bg-card border border-border rounded-lg overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-sm" :class="$slots.colgroup && 'table-fixed'">
        <slot name="colgroup" />
        <thead class="bg-bg-hard border-b border-border">
          <tr class="text-left text-xs uppercase tracking-widest text-muted">
            <th
              v-for="col in columns"
              :key="col.key"
              class="px-4 py-3 font-bold"
              :class="col.align === 'right' && 'text-right'"
            >
              <button
                v-if="col.sortable"
                class="inline-flex items-center gap-1 text-xs uppercase tracking-widest font-bold text-muted hover:text-fg transition-colors"
                :class="sortCol === col.key && 'text-fg'"
                @click="emit('toggle-sort', col.key)"
              >
                {{ col.label }}
                <span class="text-[10px]">{{ flecha(col.key) }}</span>
              </button>
              <template v-else>{{ col.label }}</template>
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-if="pending">
            <slot name="skeleton" />
          </template>
          <template v-else-if="!rows.length">
            <tr>
              <td :colspan="columns.length" class="px-4 py-16 text-center text-muted">
                {{ emptyText ?? 'Sin resultados.' }}
              </td>
            </tr>
          </template>
          <template v-else>
            <template v-for="row in rows" :key="row.id">
              <slot name="row" :row="row" />
            </template>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>
