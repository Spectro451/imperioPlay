<script setup lang="ts">
import type { MetodoPago, FiltroVentasParams } from '~/composables/api/useVentaApi'
import type { Usuario } from '~/composables/api/useUsuarioApi'

const props = defineProps<{
  modelValue: FiltroVentasParams
  vendedores: Usuario[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: FiltroVentasParams): void
  (e: 'limpiar'): void
}>()

function actualizar<K extends keyof FiltroVentasParams>(key: K, valor: FiltroVentasParams[K]) {
  emit('update:modelValue', { ...props.modelValue, [key]: valor })
}

function inicioDelDiaLocal(fecha: string): string | undefined {
  if (!fecha) return undefined
  return new Date(`${fecha}T00:00:00`).toISOString()
}

function finDelDiaLocal(fecha: string): string | undefined {
  if (!fecha) return undefined
  return new Date(`${fecha}T23:59:59.999`).toISOString()
}

function inputALocal(iso?: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

const inputClass = 'bg-bg-card border border-border text-sm text-fg rounded px-3 py-2 focus:outline-none focus:border-acento-1 transition-colors'

const metodos: { valor: MetodoPago; label: string }[] = [
  { valor: 'efectivo', label: 'Efectivo' },
  { valor: 'debito', label: 'Débito' },
  { valor: 'credito', label: 'Crédito' },
]
</script>

<template>
  <div class="flex flex-wrap gap-3 mb-6 items-end">
    <div>
      <label class="block text-xs uppercase tracking-widest text-muted font-bold mb-1">Desde</label>
      <input
        type="date"
        :value="inputALocal(modelValue.desde)"
        :class="inputClass"
        @input="actualizar('desde', inicioDelDiaLocal(($event.target as HTMLInputElement).value))"
      />
    </div>
    <div>
      <label class="block text-xs uppercase tracking-widest text-muted font-bold mb-1">Hasta</label>
      <input
        type="date"
        :value="inputALocal(modelValue.hasta)"
        :class="inputClass"
        @input="actualizar('hasta', finDelDiaLocal(($event.target as HTMLInputElement).value))"
      />
    </div>
    <div>
      <label class="block text-xs uppercase tracking-widest text-muted font-bold mb-1">Vendedor</label>
      <select
        :value="modelValue.vendedor_id ?? ''"
        :class="inputClass"
        @change="actualizar('vendedor_id', ($event.target as HTMLSelectElement).value ? Number(($event.target as HTMLSelectElement).value) : undefined)"
      >
        <option value="">Todos</option>
        <option v-for="v in vendedores" :key="v.id" :value="v.id">
          {{ v.nombre }}
        </option>
      </select>
    </div>
    <div>
      <label class="block text-xs uppercase tracking-widest text-muted font-bold mb-1">Método</label>
      <select
        :value="modelValue.metodo_pago ?? ''"
        :class="inputClass"
        @change="actualizar('metodo_pago', (($event.target as HTMLSelectElement).value as MetodoPago) || undefined)"
      >
        <option value="">Todos</option>
        <option v-for="m in metodos" :key="m.valor" :value="m.valor">{{ m.label }}</option>
      </select>
    </div>
    <button
      class="text-xs text-muted hover:text-danger transition-colors py-2"
      @click="emit('limpiar')"
    >
      Limpiar filtros
    </button>
  </div>
</template>
