<script setup lang="ts">
import type { ItemFlat } from '~/composables/useProductoTypes'
import type { LineaVenta } from '~/composables/useVentaEnCurso'

defineProps<{
  lineas: readonly LineaVenta[]
}>()

const emit = defineEmits<{
  (e: 'cambiar-cantidad', variante: ItemFlat, cantidad: number): void
  (e: 'quitar', variante: ItemFlat): void
}>()

function subtotal(linea: LineaVenta) {
  return linea.variante.precio_final * linea.cantidad
}
</script>

<template>
  <div class="bg-bg-card border border-border rounded-lg overflow-hidden">
    <div class="px-4 py-3 border-b border-border bg-bg-hard">
      <p class="text-xs uppercase tracking-widest text-muted font-bold">Items en la venta</p>
    </div>

    <div v-if="!lineas.length" class="p-8 text-center text-muted text-sm">
      Todavía no hay items. Buscá por SKU o nombre para agregar.
    </div>

    <ul v-else class="divide-y divide-border">
      <li
        v-for="linea in lineas"
        :key="`${linea.variante.tipo}-${linea.variante.id}`"
        class="p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
      >
        <div class="min-w-0 flex-1 flex items-start justify-between gap-3">
          <div class="min-w-0 flex-1">
            <p class="text-sm font-bold truncate">{{ linea.variante.nombre }}</p>
            <p class="text-xs text-muted capitalize mt-0.5">
              {{ linea.variante.tipo }} · {{ linea.variante.plataforma }} · {{ linea.variante.estado }}
            </p>
            <p class="text-[10px] text-muted mt-0.5">
              ${{ linea.variante.precio_final.toLocaleString('es-AR') }} c/u · Stock: {{ linea.variante.stock }}
            </p>
          </div>
          <button
            class="sm:hidden text-muted hover:text-danger text-lg leading-none shrink-0"
            aria-label="Quitar"
            @click="emit('quitar', linea.variante)"
          >
            ×
          </button>
        </div>

        <div class="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
          <div class="flex items-center gap-1 shrink-0">
            <button
              class="w-7 h-7 border border-border rounded text-muted hover:text-fg hover:border-acento-1 transition-colors"
              :disabled="linea.cantidad <= 1"
              @click="emit('cambiar-cantidad', linea.variante, linea.cantidad - 1)"
            >
              −
            </button>
            <input
              :value="linea.cantidad"
              type="number"
              min="1"
              :max="linea.variante.stock"
              class="w-12 h-7 text-center bg-bg-hard border border-border rounded text-sm text-fg focus:outline-none focus:border-acento-1"
              @change="emit('cambiar-cantidad', linea.variante, Number(($event.target as HTMLInputElement).value))"
            />
            <button
              class="w-7 h-7 border border-border rounded text-muted hover:text-fg hover:border-acento-1 transition-colors"
              :disabled="linea.cantidad >= linea.variante.stock"
              @click="emit('cambiar-cantidad', linea.variante, linea.cantidad + 1)"
            >
              +
            </button>
          </div>

          <p class="text-sm font-bold text-acento-1 shrink-0 sm:w-24 sm:text-right">
            ${{ subtotal(linea).toLocaleString('es-AR') }}
          </p>

          <button
            class="hidden sm:block text-muted hover:text-danger text-lg leading-none shrink-0"
            aria-label="Quitar"
            @click="emit('quitar', linea.variante)"
          >
            ×
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>
