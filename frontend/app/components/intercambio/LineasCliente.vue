<script setup lang="ts">
import type { JuegoClienteInput } from '~/composables/useIntercambioEnCurso'

defineProps<{
  juegos: JuegoClienteInput[]
}>()

const { tierDe } = useTierConfigCache()

const emit = defineEmits<{
  (e: 'agregar'): void
  (e: 'editar', key: string): void
  (e: 'quitar', key: string): void
  (e: 'cambiar-cantidad', key: string, cantidad: number): void
}>()

function estaCompleto(j: JuegoClienteInput): boolean {
  return j.sku.trim().length > 0
    && j.nombre.trim().length > 0
    && j.consola !== ''
    && j.precio_base > 0
    && j.cantidad > 0
}
</script>

<template>
  <div class="bg-bg-card border border-border rounded-lg overflow-hidden">
    <div class="px-4 py-3 border-b border-border bg-bg-hard flex items-center justify-between">
      <p class="text-xs uppercase tracking-widest text-muted font-bold">Trae el cliente</p>
      <button
        type="button"
        class="text-xs font-bold text-acento-1 hover:opacity-80 transition-opacity"
        @click="emit('agregar')"
      >
        + Agregar juego
      </button>
    </div>

    <div v-if="!juegos.length" class="p-8 text-center text-muted text-sm">
      Agregá los juegos que trae el cliente.
    </div>

    <ul v-else class="divide-y divide-border">
      <li
        v-for="j in juegos"
        :key="j.key"
        class="p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
      >
        <div class="min-w-0 flex-1 flex items-start justify-between gap-3">
          <button
            type="button"
            class="min-w-0 flex-1 text-left"
            @click="emit('editar', j.key)"
          >
            <p class="text-sm font-bold truncate">
              {{ j.nombre || 'Sin nombre' }}
              <span v-if="!estaCompleto(j)" class="text-xs text-warning font-normal ml-2">Incompleto</span>
            </p>
            <p class="text-xs text-muted capitalize mt-0.5">
              {{ j.consola || '—' }} · {{ j.estado }}
            </p>
            <p v-if="j.sku" class="text-xs text-muted mt-0.5 font-mono">SKU: {{ j.sku }}</p>
            <p class="text-[10px] text-muted mt-0.5">
              ${{ j.precio_base.toLocaleString('es-AR') }} × {{ j.cantidad }}
            </p>
          </button>
          <button
            type="button"
            class="sm:hidden text-muted hover:text-danger text-lg leading-none shrink-0"
            aria-label="Quitar"
            @click.stop="emit('quitar', j.key)"
          >
            ×
          </button>
        </div>

        <div class="flex items-center justify-between sm:justify-end gap-3 sm:gap-4" @click.stop>
          <div class="flex items-center gap-1 shrink-0">
            <button
              type="button"
              class="w-7 h-7 border border-border rounded text-muted hover:text-fg hover:border-acento-1 transition-colors"
              :disabled="j.cantidad <= 1"
              @click="emit('cambiar-cantidad', j.key, j.cantidad - 1)"
            >
              −
            </button>
            <input
              :value="j.cantidad"
              type="number"
              min="1"
              class="w-12 h-7 text-center bg-bg-hard border border-border rounded text-sm text-fg focus:outline-none focus:border-acento-1"
              @change="emit('cambiar-cantidad', j.key, Number(($event.target as HTMLInputElement).value))"
            />
            <button
              type="button"
              class="w-7 h-7 border border-border rounded text-muted hover:text-fg hover:border-acento-1 transition-colors"
              @click="emit('cambiar-cantidad', j.key, j.cantidad + 1)"
            >
              +
            </button>
          </div>
          <div class="shrink-0 sm:w-24 sm:text-right">
            <p class="text-[10px] uppercase tracking-widest text-muted">Tier</p>
            <p class="text-sm font-bold text-acento-1">
              {{ j.tierMerge ?? tierDe(j.precio_base) }} × {{ j.cantidad }}
            </p>
          </div>
          <button
            type="button"
            class="hidden sm:block text-muted hover:text-danger text-lg leading-none shrink-0"
            aria-label="Quitar"
            @click="emit('quitar', j.key)"
          >
            ×
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>
