<script setup lang="ts">
import type { Usuario } from '~/composables/api/useUsuarioApi'

const props = defineProps<{
  empleado: Usuario
}>()

const emit = defineEmits<{
  close: []
  saved: []
}>()

const { resetPassword } = useUsuarioApi()

const nueva = ref('')
const confirmacion = ref('')
const loading = ref(false)
const error = ref('')

const mismatch = computed(
  () => confirmacion.value.length > 0 && nueva.value !== confirmacion.value,
)

const puedeGuardar = computed(
  () => nueva.value.length >= 6 && nueva.value === confirmacion.value,
)

async function submit() {
  if (!puedeGuardar.value || loading.value) return
  loading.value = true
  error.value = ''
  try {
    await resetPassword(props.empleado.id, nueva.value)
    emit('saved')
  } catch (e: any) {
    error.value = e?.data?.message ?? 'No se pudo resetear la contraseña'
  } finally {
    loading.value = false
  }
}

const inputClass = 'bg-bg-hard border border-border text-sm text-fg rounded px-3 py-2 focus:outline-none focus:border-acento-1 transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed'
const labelClass = 'text-xs font-semibold uppercase tracking-widest text-muted mb-1'
</script>

<template>
  <div class="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" @click.self="emit('close')">
    <div class="bg-bg-card border border-border rounded-lg w-full max-w-md">
      <div class="px-6 py-4 border-b border-border flex items-center justify-between">
        <h2 class="text-lg font-black tracking-tight">Resetear contraseña</h2>
        <button class="text-muted hover:text-fg text-xl leading-none" @click="emit('close')">×</button>
      </div>

      <form class="px-6 py-4 flex flex-col gap-3" @submit.prevent="submit">
        <p class="text-sm text-muted">
          Nueva contraseña para <span class="font-bold text-fg">{{ empleado.nombre }}</span>. El empleado deberá usar esta clave en el próximo login.
        </p>

        <div class="flex flex-col gap-1">
          <label :class="labelClass">Nueva contraseña</label>
          <input
            v-model="nueva"
            type="password"
            required
            minlength="6"
            :class="inputClass"
            :disabled="loading"
            placeholder="Mínimo 6 caracteres"
          />
          <p v-if="nueva.length > 0 && nueva.length < 6" class="text-xs text-danger">
            Debe tener al menos 6 caracteres
          </p>
        </div>

        <div class="flex flex-col gap-1">
          <label :class="labelClass">Confirmar contraseña</label>
          <input
            v-model="confirmacion"
            type="password"
            required
            :class="inputClass"
            :disabled="loading"
            placeholder="Repetir la nueva contraseña"
          />
          <p v-if="mismatch" class="text-xs text-danger">
            Las contraseñas no coinciden
          </p>
        </div>

        <p v-if="error" class="text-sm text-danger">{{ error }}</p>

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
            type="submit"
            :disabled="loading || !puedeGuardar"
            class="flex-1 px-4 py-2 text-sm font-bold text-acento-1 border border-acento-1 hover:bg-acento-1 hover:text-bg-hard rounded transition-colors disabled:opacity-50"
          >
            {{ loading ? 'Reseteando...' : 'Resetear' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
