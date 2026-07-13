<script setup lang="ts">
import type { ItemFlat } from '~/composables/useProductoTypes'

defineProps<{
  items: ItemFlat[]
  pending: boolean
}>()

const emit = defineEmits<{
  (e: 'editar', item: ItemFlat): void
  (e: 'eliminar', item: ItemFlat): void
  (e: 'reactivar', item: ItemFlat): void
}>()
</script>

<template>
  <div class="flex flex-col gap-3">
    <template v-if="pending">
      <SkeletonProductosCards />
    </template>
    <template v-else-if="!items.length">
      <p class="bg-bg-card border border-border rounded-lg p-6 text-center text-muted text-sm">
        Sin resultados.
      </p>
    </template>
    <template v-else>
      <div
        v-for="item in items"
        :key="`card-${item.tipo}-${item.id}`"
        class="bg-bg-card border border-border rounded-lg p-4 flex flex-col gap-3"
        :class="!item.isActive && 'opacity-50'"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0 flex-1">
            <p class="font-bold truncate">{{ item.nombre }}</p>
            <p class="text-xs text-muted capitalize mt-0.5">
              {{ item.tipo }} · {{ item.plataforma }} · {{ item.estado }}
            </p>
            <p v-if="item.sku" class="text-[10px] text-muted font-mono mt-0.5">SKU: {{ item.sku }}</p>
          </div>
          <div class="flex flex-col items-end shrink-0 leading-tight">
            <span
              v-if="tieneOferta(item)"
              class="text-xs text-muted line-through"
            >
              ${{ formatearPrecio(item.precio_base) }}
            </span>
            <span class="text-base font-bold text-acento-1">
              ${{ formatearPrecio(item.precio_final) }}
            </span>
            <span
              v-if="tieneOferta(item)"
              class="text-[10px] font-bold text-muted uppercase tracking-wider"
            >
              {{ textoDescuentoProducto(item) }}
            </span>
          </div>
        </div>

        <div class="flex items-center justify-between text-xs">
          <span class="text-muted">
            Stock: <span class="font-bold" :class="stockClass(item.stock) || 'text-fg'">{{ item.stock }}</span>
          </span>
          <div class="flex gap-4">
            <button
              class="text-muted hover:text-acento-1 transition-colors"
              @click="emit('editar', item)"
            >
              Editar
            </button>
            <button
              v-if="item.isActive"
              class="text-muted hover:text-red-500 transition-colors"
              @click="emit('eliminar', item)"
            >
              Eliminar
            </button>
            <button
              v-else
              class="text-muted hover:text-acento-1 transition-colors"
              @click="emit('reactivar', item)"
            >
              Reactivar
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
