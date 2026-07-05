<script setup lang="ts">
const props = defineProps<{
  page: number
  totalPages: number
}>()

const emit = defineEmits<{
  'update:page': [page: number]
}>()

const inputPagina = ref('')

function irAPagina() {
  const n = parseInt(inputPagina.value)
  if (!isNaN(n) && n >= 1 && n <= props.totalPages) {
    emit('update:page', n)
  }
  inputPagina.value = ''
}
</script>

<template>
  <div class="flex items-center justify-center gap-4 mt-10">
    <button
      :disabled="page <= 1"
      class="px-4 py-2 text-sm font-medium bg-bg-card rounded disabled:opacity-30 hover:text-acento-1 transition-colors"
      @click="emit('update:page', page - 1)"
    >
      ← Anterior
    </button>

    <div class="flex items-center gap-2 text-sm text-muted">
      <span>{{ page }} / {{ totalPages }}</span>
      <input
        v-model="inputPagina"
        type="number"
        min="1"
        :max="totalPages"
        placeholder="ir a..."
        class="w-16 bg-bg-card border border-border rounded px-2 py-1 text-center text-fg text-sm focus:outline-none focus:border-acento-1 transition-colors"
        @keydown.enter="irAPagina"
      />
    </div>

    <button
      :disabled="page >= totalPages"
      class="px-4 py-2 text-sm font-medium bg-bg-card rounded disabled:opacity-30 hover:text-acento-1 transition-colors"
      @click="emit('update:page', page + 1)"
    >
      Siguiente →
    </button>
  </div>
</template>
