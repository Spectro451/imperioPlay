<script setup lang="ts">
import type { Usuario } from '~/composables/api/useUsuarioApi'
import { esRutValido, normalizarRut } from '~/utils/rut'

const props = defineProps<{
  empleado?: Usuario | null
}>()

const emit = defineEmits<{
  close: []
  saved: []
}>()

const { createEmpleado, update } = useUsuarioApi()

const esEdicion = computed(() => !!props.empleado)

const nombre = ref(props.empleado?.nombre ?? '')
const correo = ref(props.empleado?.correo ?? '')
const password = ref('')
const rut = ref(props.empleado?.rut ?? '')

const loading = ref(false)
const error = ref('')

const rutError = computed(() => {
  if (!rut.value.trim()) return ''
  return esRutValido(rut.value) ? '' : 'RUT inválido (formato 12345678-9)'
})

const hayCambios = computed(() => {
  if (!esEdicion.value || !props.empleado) return true
  return nombre.value.trim() !== props.empleado.nombre
    || correo.value.trim().toLowerCase() !== props.empleado.correo
    || normalizarRut(rut.value) !== (props.empleado.rut ?? '')
})

const puedeGuardar = computed(() => {
  const base = nombre.value.trim().length > 0
    && /^\S+@\S+\.\S+$/.test(correo.value)
    && esRutValido(rut.value)
  if (esEdicion.value) return base && hayCambios.value
  return base && password.value.length >= 6
})

async function submit() {
  if (!puedeGuardar.value || loading.value) return
  loading.value = true
  error.value = ''
  try {
    if (esEdicion.value && props.empleado) {
      await update(props.empleado.id, {
        nombre: nombre.value.trim(),
        correo: correo.value.trim().toLowerCase(),
        rut: normalizarRut(rut.value),
      })
    } else {
      await createEmpleado({
        nombre: nombre.value.trim(),
        correo: correo.value.trim().toLowerCase(),
        password: password.value,
        rut: normalizarRut(rut.value),
      })
    }
    emit('saved')
  } catch (e: any) {
    error.value = e?.data?.message ?? (esEdicion.value ? 'No se pudo actualizar el empleado' : 'No se pudo crear el empleado')
  } finally {
    loading.value = false
  }
}

const inputClass = 'bg-bg-hard border border-border text-sm text-fg rounded px-3 py-2 focus:outline-none focus:border-acento-1 transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed'
const labelClass = 'text-xs font-semibold uppercase tracking-widest text-muted mb-1'
</script>

<template>
  <div class="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" @click.self="emit('close')">
    <div class="bg-bg-card border border-border rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <div class="px-6 py-4 border-b border-border flex items-center justify-between">
        <h2 class="text-lg font-black tracking-tight">
          {{ esEdicion ? 'Editar empleado' : 'Nuevo empleado' }}
        </h2>
        <button class="text-muted hover:text-fg text-xl leading-none" @click="emit('close')">×</button>
      </div>

      <form class="px-6 py-4 flex flex-col gap-3" @submit.prevent="submit">
        <div class="flex flex-col gap-1">
          <label :class="labelClass">Nombre</label>
          <input
            v-model="nombre"
            required
            :class="inputClass"
            :disabled="loading"
            placeholder="Nombre completo"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label :class="labelClass">Correo</label>
          <input
            v-model="correo"
            type="email"
            required
            :class="inputClass"
            :disabled="loading"
            placeholder="correo@ejemplo.com"
          />
        </div>

        <div v-if="!esEdicion" class="flex flex-col gap-1">
          <label :class="labelClass">Contraseña</label>
          <input
            v-model="password"
            type="password"
            required
            minlength="6"
            :class="inputClass"
            :disabled="loading"
            placeholder="Mínimo 6 caracteres"
          />
          <p v-if="password.length > 0 && password.length < 6" class="text-xs text-danger">
            Debe tener al menos 6 caracteres
          </p>
        </div>

        <div class="flex flex-col gap-1">
          <label :class="labelClass">RUT</label>
          <input
            v-model="rut"
            required
            :class="inputClass"
            :disabled="loading"
            placeholder="12345678-9"
          />
          <p v-if="rutError" class="text-xs text-danger">{{ rutError }}</p>
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
            {{ loading ? 'Guardando...' : 'Guardar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
