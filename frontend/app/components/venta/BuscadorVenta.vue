<script setup lang="ts">
import type { ItemFlat } from '~/composables/useProductoTypes'

const emit = defineEmits<{
  (e: 'seleccionar', variante: ItemFlat): void
  (e: 'multiples', variantes: ItemFlat[]): void
  (e: 'error', mensaje: string): void
}>()

const { buscarPorSku, getNombres, buscarPorNombreExacto } = useProductoApi()

const sku = ref('')
const nombre = ref('')
const sugerencias = ref<string[]>([])
const mostrarSugerencias = ref(false)
const cargandoSku = ref(false)
const cargandoNombre = ref(false)

let debounceNombre: ReturnType<typeof setTimeout> | null = null

watch(nombre, (val) => {
  if (debounceNombre) clearTimeout(debounceNombre)
  if (val.trim().length < 2) {
    sugerencias.value = []
    return
  }
  debounceNombre = setTimeout(async () => {
    try {
      sugerencias.value = (await getNombres(val.trim())).slice(0, 8)
      mostrarSugerencias.value = true
    } catch {
      sugerencias.value = []
    }
  }, 300)
})

async function resolverProducto(producto: any) {
  const variantes = variantesVendibles(aplanarVariantes(producto))
  if (!variantes.length) {
    emit('error', 'Sin variantes disponibles con stock')
    return
  }
  if (variantes.length === 1) {
    emit('seleccionar', variantes[0]!)
    return
  }
  emit('multiples', variantes)
}

async function onBuscarSku() {
  const valor = sku.value.trim()
  if (!valor) return
  cargandoSku.value = true
  try {
    const res = await buscarPorSku(valor)
    if (!res.encontrado || !res.producto) {
      emit('error', `SKU ${valor} no encontrado`)
      return
    }
    await resolverProducto(res.producto)
    sku.value = ''
  } catch (e: any) {
    emit('error', e?.data?.message ?? 'Error al buscar por SKU')
  } finally {
    cargandoSku.value = false
  }
}

async function onSeleccionarNombre(sugerido: string) {
  nombre.value = sugerido
  mostrarSugerencias.value = false
  cargandoNombre.value = true
  try {
    const producto = await buscarPorNombreExacto(sugerido)
    if (!producto) {
      emit('error', `Producto "${sugerido}" no encontrado`)
      return
    }
    await resolverProducto(producto)
    nombre.value = ''
    sugerencias.value = []
  } catch (e: any) {
    emit('error', e?.data?.message ?? 'Error al buscar por nombre')
  } finally {
    cargandoNombre.value = false
  }
}

function onBlurNombre() {
  setTimeout(() => { mostrarSugerencias.value = false }, 150)
}

const inputClass = 'bg-bg-card border border-border text-sm text-fg rounded px-3 py-2 focus:outline-none focus:border-acento-1 transition-colors w-full'
</script>

<template>
  <div class="flex flex-col md:flex-row gap-3">
    <div class="flex-1">
      <label class="block text-xs uppercase tracking-widest text-muted font-bold mb-1">SKU / Código de barras</label>
      <div class="relative">
        <input
          v-model="sku"
          :class="inputClass"
          placeholder="Escanear o escribir SKU y Enter"
          :disabled="cargandoSku"
          @keydown.enter.prevent="onBuscarSku"
        />
        <span v-if="cargandoSku" class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted">Buscando…</span>
      </div>
    </div>

    <div class="flex-1 relative">
      <label class="block text-xs uppercase tracking-widest text-muted font-bold mb-1">Buscar por nombre</label>
      <input
        v-model="nombre"
        :class="inputClass"
        placeholder="Nombre del producto"
        :disabled="cargandoNombre"
        @focus="mostrarSugerencias = true"
        @blur="onBlurNombre"
      />
      <ul
        v-if="mostrarSugerencias && sugerencias.length"
        class="absolute z-20 left-0 right-0 top-full -mt-px bg-bg-card border border-border rounded-b max-h-64 overflow-y-auto"
      >
        <li
          v-for="s in sugerencias"
          :key="s"
          class="px-3 py-2 text-sm cursor-pointer hover:bg-bg-hard transition-colors"
          @mousedown.prevent="onSeleccionarNombre(s)"
        >
          {{ s }}
        </li>
      </ul>
    </div>
  </div>
</template>
