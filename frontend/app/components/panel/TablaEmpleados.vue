<script setup lang="ts">
import type { Usuario } from '~/composables/api/useUsuarioApi'

export type SortCol = 'id' | 'nombre'
export type SortDir = 'asc' | 'desc'

defineProps<{
  empleados: Usuario[]
  pending: boolean
  sortCol: SortCol
  sortDir: SortDir
  currentUserId: number | null
}>()

const emit = defineEmits<{
  (e: 'toggle-sort', col: SortCol): void
  (e: 'eliminar', empleado: Usuario): void
  (e: 'reactivar', empleado: Usuario): void
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
            <th class="px-4 py-3 font-bold">Correo</th>
            <th class="px-4 py-3 font-bold">RUT</th>
            <th class="px-4 py-3 font-bold">Rol</th>
            <th class="px-4 py-3 font-bold">Estado</th>
            <th class="px-4 py-3 font-bold text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="pending">
            <SkeletonEmpleadosFilas />
          </template>
          <template v-else-if="!empleados.length">
            <tr>
              <td colspan="6" class="px-4 py-16 text-center text-muted">Sin resultados.</td>
            </tr>
          </template>
          <template v-else>
            <tr
              v-for="e in empleados"
              :key="e.id"
              class="border-b border-border last:border-b-0 hover:bg-bg-hard/50 transition-colors"
              :class="!e.isActive && 'opacity-50'"
            >
              <td class="px-4 py-3 font-medium">{{ e.nombre }}</td>
              <td class="px-4 py-3 text-muted">{{ e.correo }}</td>
              <td class="px-4 py-3 text-muted font-mono text-xs">{{ e.rut || '—' }}</td>
              <td class="px-4 py-3 capitalize">
                <span :class="e.rol === 'admin' ? 'text-acento-1 font-bold' : 'text-muted'">
                  {{ e.rol }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span
                  class="text-xs uppercase tracking-widest font-bold"
                  :class="e.isActive ? 'text-acento-1' : 'text-red-500'"
                >
                  {{ e.isActive ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="px-4 py-3 text-right">
                <div class="flex gap-2 justify-end">
                  <button
                    v-if="e.isActive"
                    class="text-xs text-muted hover:text-red-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-muted"
                    :disabled="e.id === currentUserId"
                    :title="e.id === currentUserId ? 'No podés desactivar tu propia cuenta' : ''"
                    @click="emit('eliminar', e)"
                  >
                    Eliminar
                  </button>
                  <button
                    v-else
                    class="text-xs text-muted hover:text-acento-1 transition-colors"
                    @click="emit('reactivar', e)"
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
