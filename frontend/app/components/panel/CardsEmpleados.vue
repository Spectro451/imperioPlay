<script setup lang="ts">
import type { Usuario } from '~/composables/api/useUsuarioApi'

defineProps<{
  empleados: Usuario[]
  pending: boolean
  currentUserId: number | null
}>()

const emit = defineEmits<{
  (e: 'editar', empleado: Usuario): void
  (e: 'reset-password', empleado: Usuario): void
  (e: 'eliminar', empleado: Usuario): void
  (e: 'reactivar', empleado: Usuario): void
}>()
</script>

<template>
  <PanelCards :rows="empleados" :pending="pending">
    <template #skeleton>
      <SkeletonEmpleadosCards />
    </template>
    <template #card="{ row: e }">
      <div
        class="bg-bg-card border border-border rounded-lg p-4 flex flex-col gap-3"
        :class="!e.isActive && 'opacity-50'"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0 flex-1">
            <p class="font-bold truncate">{{ e.nombre }}</p>
            <p class="text-xs text-muted truncate mt-0.5">{{ e.correo }}</p>
            <p v-if="e.rut" class="text-[10px] text-muted font-mono mt-0.5">RUT: {{ e.rut }}</p>
          </div>
          <span
            class="text-[10px] uppercase tracking-widest font-bold shrink-0"
            :class="e.isActive ? 'text-acento-1' : 'text-red-500'"
          >
            {{ e.isActive ? 'Activo' : 'Inactivo' }}
          </span>
        </div>

        <div class="flex items-center justify-between text-xs">
          <span
            class="uppercase tracking-widest font-bold"
            :class="e.rol === 'admin' ? 'text-acento-1' : 'text-muted'"
          >
            {{ e.rol }}
          </span>
          <div class="flex gap-4">
            <button
              v-if="e.isActive"
              class="text-muted hover:text-acento-1 transition-colors"
              @click="emit('editar', e)"
            >
              Editar
            </button>
            <button
              v-if="e.isActive"
              class="text-muted hover:text-acento-1 transition-colors"
              @click="emit('reset-password', e)"
            >
              Reset pw
            </button>
            <button
              v-if="e.isActive"
              class="text-muted hover:text-danger transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-muted"
              :disabled="e.id === currentUserId"
              @click="emit('eliminar', e)"
            >
              Eliminar
            </button>
            <button
              v-else
              class="text-muted hover:text-acento-1 transition-colors"
              @click="emit('reactivar', e)"
            >
              Reactivar
            </button>
          </div>
        </div>
      </div>
    </template>
  </PanelCards>
</template>
