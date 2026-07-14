<script setup lang="ts">
import type { ItemFlat } from '~/composables/useProductoTypes'

const props = defineProps<{
  variantes: ItemFlat[]
}>()

const emit = defineEmits<{
  (e: 'seleccionar', variante: ItemFlat): void
  (e: 'cerrar'): void
}>()

const nombre = computed(() => props.variantes[0]?.nombre ?? '')
</script>

<template>
  <div
    class="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
    @click.self="emit('cerrar')"
  >
    <div class="bg-bg-card border border-border rounded-lg w-full max-w-lg max-h-[85vh] flex flex-col">
      <div class="p-5 border-b border-border flex items-start justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-widest text-muted font-bold mb-1">Elegí variante</p>
          <h2 class="text-lg font-black tracking-tight">{{ nombre }}</h2>
        </div>
        <button
          class="text-muted hover:text-fg text-xl leading-none"
          aria-label="Cerrar"
          @click="emit('cerrar')"
        >
          ×
        </button>
      </div>

      <div class="p-3 overflow-y-auto flex flex-col gap-2">
        <button
          v-for="v in variantes"
          :key="`${v.tipo}-${v.id}`"
          class="w-full text-left bg-bg-hard border border-border rounded p-3 hover:border-acento-1 transition-colors flex items-center justify-between gap-4"
          @click="emit('seleccionar', v)"
        >
          <div class="min-w-0">
            <p class="text-sm font-bold capitalize">
              {{ v.tipo }} · {{ v.plataforma }} · {{ v.estado }}
            </p>
            <p v-if="v.sku" class="text-xs text-muted mt-0.5 font-mono">SKU: {{ v.sku }}</p>
            <p class="text-xs text-muted mt-0.5">Stock: {{ v.stock }}</p>
          </div>
          <div class="text-right shrink-0">
            <p class="text-sm font-bold text-acento-1">${{ v.precio_final.toLocaleString('es-AR') }}</p>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>
