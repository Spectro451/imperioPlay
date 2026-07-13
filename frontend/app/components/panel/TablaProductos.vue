<script setup lang="ts">
import type { ItemFlat } from '~/composables/useProductoTypes'

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

function flecha(col: SortCol, currentCol: SortCol, dir: SortDir): string {
  if (col !== currentCol) return '↕'
  return dir === 'asc' ? '▲' : '▼'
}
</script>

<template>
  <div class="bg-bg-card border border-border rounded-lg overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-bg-hard border-b border-border">
          <tr class="text-left text-xs uppercase tracking-widest text-muted">
            <th class="px-4 py-3 font-bold">
              <button
                class="inline-flex items-center gap-1 text-xs uppercase tracking-widest font-bold text-muted hover:text-fg transition-colors"
                :class="sortCol === 'nombre' && 'text-fg'"
                @click="emit('toggle-sort', 'nombre')"
              >
                Nombre
                <span class="text-[10px]">{{ flecha('nombre', sortCol, sortDir) }}</span>
              </button>
            </th>
            <th class="px-4 py-3 font-bold">SKU</th>
            <th class="px-4 py-3 font-bold">Tipo</th>
            <th class="px-4 py-3 font-bold">Plataforma</th>
            <th class="px-4 py-3 font-bold">Estado</th>
            <th class="px-4 py-3 font-bold text-right">
              <button
                class="inline-flex items-center gap-1 text-xs uppercase tracking-widest font-bold text-muted hover:text-fg transition-colors"
                :class="sortCol === 'stock' && 'text-fg'"
                @click="emit('toggle-sort', 'stock')"
              >
                Stock
                <span class="text-[10px]">{{ flecha('stock', sortCol, sortDir) }}</span>
              </button>
            </th>
            <th class="px-4 py-3 font-bold text-right">
              <button
                class="inline-flex items-center gap-1 text-xs uppercase tracking-widest font-bold text-muted hover:text-fg transition-colors"
                :class="sortCol === 'precio' && 'text-fg'"
                @click="emit('toggle-sort', 'precio')"
              >
                Precio
                <span class="text-[10px]">{{ flecha('precio', sortCol, sortDir) }}</span>
              </button>
            </th>
            <th class="px-4 py-3 font-bold text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="pending">
            <SkeletonProductosFilas />
          </template>
          <template v-else-if="!items.length">
            <tr>
              <td colspan="8" class="px-4 py-16 text-center text-muted">Sin resultados.</td>
            </tr>
          </template>
          <template v-else>
            <tr
              v-for="item in items"
              :key="`${item.tipo}-${item.id}`"
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
        </tbody>
      </table>
    </div>
  </div>
</template>
