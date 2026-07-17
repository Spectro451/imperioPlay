<script setup lang="ts">
import type { Usuario } from '~/composables/api/useUsuarioApi'
import type { PanelTablaColumn } from './PanelTabla.vue'

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
  (e: 'editar', empleado: Usuario): void
  (e: 'reset-password', empleado: Usuario): void
  (e: 'eliminar', empleado: Usuario): void
  (e: 'reactivar', empleado: Usuario): void
}>()

const columns: PanelTablaColumn[] = [
  { key: 'nombre', label: 'Nombre', sortable: true },
  { key: 'correo', label: 'Correo' },
  { key: 'rut', label: 'RUT' },
  { key: 'rol', label: 'Rol' },
  { key: 'estado', label: 'Estado' },
  { key: 'acciones', label: 'Acciones', align: 'right' },
]
</script>

<template>
  <PanelTabla
    :columns="columns"
    :rows="empleados"
    :pending="pending"
    :sort-col="sortCol"
    :sort-dir="sortDir"
    @toggle-sort="(c) => emit('toggle-sort', c as SortCol)"
  >
    <template #skeleton>
      <SkeletonEmpleadosFilas />
    </template>
    <template #row="{ row: e }">
      <tr
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
          <div class="flex gap-3 justify-end">
            <button
              v-if="e.isActive"
              class="text-xs text-muted hover:text-acento-1 transition-colors"
              @click="emit('editar', e)"
            >
              Editar
            </button>
            <button
              v-if="e.isActive"
              class="text-xs text-muted hover:text-acento-1 transition-colors"
              @click="emit('reset-password', e)"
            >
              Reset pw
            </button>
            <button
              v-if="e.isActive"
              class="text-xs text-muted hover:text-danger transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-muted"
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
  </PanelTabla>
</template>
