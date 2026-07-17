<script setup lang="ts">
defineProps<{
  page: number
  totalPaginas: number
}>()

const emit = defineEmits<{
  (e: 'update:page', v: number): void
}>()
</script>

<template>
  <div v-if="totalPaginas > 1" class="flex items-center justify-center gap-3 mt-6">
    <button
      :disabled="page === 1"
      class="px-3 py-1.5 text-sm border border-border rounded text-muted hover:text-fg disabled:opacity-30 disabled:cursor-not-allowed"
      @click="emit('update:page', page - 1)"
    >
      ← Anterior
    </button>
    <span class="text-sm text-muted">Página {{ page }} de {{ totalPaginas }}</span>
    <button
      :disabled="page === totalPaginas"
      class="px-3 py-1.5 text-sm border border-border rounded text-muted hover:text-fg disabled:opacity-30 disabled:cursor-not-allowed"
      @click="emit('update:page', page + 1)"
    >
      Siguiente →
    </button>
  </div>
</template>
