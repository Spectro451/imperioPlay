<script setup lang="ts">
const props = withDefaults(defineProps<{
  titulo: string
  mensaje: string
  labelConfirmar?: string
  variante?: 'warning' | 'danger'
  loading?: boolean
}>(), {
  labelConfirmar: 'Confirmar',
  variante: 'warning',
  loading: false,
})

const emit = defineEmits<{
  close: []
  confirmar: []
}>()

const claseConfirmar = computed(() =>
  props.variante === 'danger'
    ? 'flex-1 px-4 py-2 text-sm font-bold text-danger border border-danger hover:bg-danger hover:text-bg-hard rounded transition-colors disabled:opacity-50'
    : 'flex-1 px-4 py-2 text-sm font-bold text-warning border border-warning hover:bg-warning hover:text-bg-hard rounded transition-colors disabled:opacity-50',
)
</script>

<template>
  <Teleport to="body">
  <div class="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" @click.self="emit('close')">
    <div class="bg-bg-card border border-border rounded-lg w-full max-w-md">
      <div class="px-6 py-4 border-b border-border flex items-center justify-between">
        <h2 class="text-lg font-black tracking-tight">{{ titulo }}</h2>
        <button class="text-muted hover:text-fg text-xl leading-none" @click="emit('close')">×</button>
      </div>

      <div class="px-6 py-4 flex flex-col gap-4">
        <p class="text-sm text-muted whitespace-pre-line">{{ mensaje }}</p>

        <div class="flex gap-3 pt-2">
          <button
            type="button"
            :disabled="loading"
            class="flex-1 px-4 py-2 text-sm text-muted hover:text-fg border border-border rounded transition-colors"
            @click="emit('close')"
          >
            Cancelar
          </button>
          <button
            type="button"
            :disabled="loading"
            :class="claseConfirmar"
            @click="emit('confirmar')"
          >
            {{ loading ? 'Procesando...' : labelConfirmar }}
          </button>
        </div>
      </div>
    </div>
  </div>
  </Teleport>
</template>
