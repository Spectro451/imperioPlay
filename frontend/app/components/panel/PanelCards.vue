<script setup lang="ts" generic="T extends { id: number | string }">
defineProps<{
  rows: T[]
  pending: boolean
  emptyText?: string
}>()

defineSlots<{
  skeleton(): any
  card(p: { row: T }): any
}>()
</script>

<template>
  <div class="flex flex-col gap-3">
    <template v-if="pending">
      <slot name="skeleton" />
    </template>
    <template v-else-if="!rows.length">
      <p class="bg-bg-card border border-border rounded-lg p-6 text-center text-muted text-sm">
        {{ emptyText ?? 'Sin resultados.' }}
      </p>
    </template>
    <template v-else>
      <template v-for="row in rows" :key="row.id">
        <slot name="card" :row="row" />
      </template>
    </template>
  </div>
</template>
