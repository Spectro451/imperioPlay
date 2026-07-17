<script setup lang="ts">
import type { Usuario } from '~/composables/api/useUsuarioApi'

const props = defineProps<{
  vendedor: Usuario | null
}>()

const emit = defineEmits<{
  (e: 'update:vendedor', v: Usuario | null): void
  (e: 'error', mensaje: string): void
}>()

const { getEmpleados } = useUsuarioApi()
const { user } = useAuth()

const empleados = ref<Usuario[]>([])
const cargando = ref(false)

const vendedorId = computed<number | ''>({
  get: () => props.vendedor?.id ?? '',
  set: (id) => {
    if (id === '') {
      emit('update:vendedor', null)
      return
    }
    const seleccionado = empleados.value.find(e => e.id === id)
    emit('update:vendedor', seleccionado ?? null)
  },
})

onMounted(async () => {
  cargando.value = true
  try {
    empleados.value = (await getEmpleados()).filter(e => e.isActive && e.rut)
    if (!props.vendedor) {
      const yo = empleados.value.find(e => e.id === user.value?.id)
      const fallback = empleados.value.find(e => e.rol === 'admin')
      const inicial = yo ?? fallback
      if (inicial) emit('update:vendedor', inicial)
    }
  } catch (e: any) {
    emit('error', e?.data?.message ?? 'No se pudo cargar la lista de vendedores')
  } finally {
    cargando.value = false
  }
})

const inputClass = 'bg-bg-card border border-border text-sm text-fg rounded px-3 py-2 focus:outline-none focus:border-acento-1 transition-colors w-full appearance-none pr-8'
</script>

<template>
  <div>
    <label class="block text-xs uppercase tracking-widest text-muted font-bold mb-1">Vendedor</label>
    <div class="relative">
      <select
        v-model="vendedorId"
        :class="inputClass"
        :disabled="cargando || !empleados.length"
      >
        <option value="" disabled>
          {{ cargando ? 'Cargando…' : empleados.length ? 'Seleccionar vendedor' : 'Sin vendedores disponibles' }}
        </option>
        <option
          v-for="e in empleados"
          :key="e.id"
          :value="e.id"
        >
          {{ e.rut }}
        </option>
      </select>
      <span class="absolute right-3 top-1/2 -translate-y-1/2 text-muted text-xs pointer-events-none">▼</span>
    </div>
  </div>
</template>
