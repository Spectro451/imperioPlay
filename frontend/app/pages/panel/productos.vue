<script setup lang="ts">
import type { ItemFlat } from '~/composables/useProductoTypes'
import type { SortCol, SortDir } from '~/components/panel/TablaProductos.vue'

definePageMeta({ middleware: 'panel', layout: 'panel' })

const { getAll } = useProductoApi()
const { remove: removeJuego, restore: restoreJuego } = useJuegoApi()
const { remove: removeConsola, restore: restoreConsola } = useConsolaApi()

const busqueda = ref('')
const busquedaSku = ref('')
const tipoFiltro = ref('')
const plataformaFiltro = ref('')
const activoFiltro = ref<'todos' | 'true' | 'false'>('todos')
const page = ref(1)

const sortCol = ref<SortCol>('id')
const sortDir = ref<SortDir>('desc')

const ordenBackend = computed(() => {
  const dir = sortDir.value === 'asc' ? 'asc' : 'desc'
  const map: Record<SortCol, string> = {
    id: dir === 'asc' ? 'id' : 'id-desc',
    nombre: dir === 'asc' ? 'abc' : 'abc-desc',
    stock: dir === 'asc' ? 'stock-asc' : 'stock-desc',
    precio: dir === 'asc' ? 'precio-asc' : 'precio-desc',
  }
  return map[sortCol.value]
})

function dirInicial(col: SortCol): SortDir {
  return col === 'nombre' ? 'asc' : 'desc'
}

function toggleSort(col: SortCol) {
  if (sortCol.value !== col) {
    sortCol.value = col
    sortDir.value = dirInicial(col)
    return
  }
  if (sortDir.value === dirInicial(col)) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortCol.value = 'id'
    sortDir.value = 'desc'
  }
}

const busquedaDebounced = ref('')
const busquedaSkuDebounced = ref('')
let debounceTimer: ReturnType<typeof setTimeout> | null = null
let debounceSkuTimer: ReturnType<typeof setTimeout> | null = null
watch(busqueda, (val) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => { busquedaDebounced.value = val }, 350)
})
watch(busquedaSku, (val) => {
  if (debounceSkuTimer) clearTimeout(debounceSkuTimer)
  debounceSkuTimer = setTimeout(() => { busquedaSkuDebounced.value = val }, 350)
})

const params = computed(() => ({
  nombre: busquedaDebounced.value || undefined,
  sku: busquedaSkuDebounced.value || undefined,
  consola: plataformaFiltro.value || undefined,
  tipo: tipoFiltro.value || undefined,
  activo: activoFiltro.value,
  page: page.value,
  orden: ordenBackend.value,
}))

watch(() => [busquedaDebounced.value, busquedaSkuDebounced.value, tipoFiltro.value, plataformaFiltro.value, activoFiltro.value, ordenBackend.value], () => {
  page.value = 1
}, { flush: 'sync' })

const { data, pending, refresh } = await useAsyncData(
  'panel-productos',
  () => getAll(params.value),
  { watch: [params] },
)

const items = computed(() => data.value?.items ?? [])
const totalPaginas = computed(() => data.value?.totalPaginas ?? 1)

const plataformas = ['Xbox360', 'XboxOne', 'XboxSeries', 'Ps3', 'Ps4', 'Ps5', 'Switch', 'Switch2']

const modalAbierto = ref(false)
const itemEditando = ref<ItemFlat | null>(null)

function abrirNuevo() {
  itemEditando.value = null
  modalAbierto.value = true
}

function abrirEditar(item: ItemFlat) {
  itemEditando.value = item
  modalAbierto.value = true
}

function cerrarModal() {
  modalAbierto.value = false
  itemEditando.value = null
}

async function onSaved() {
  cerrarModal()
  await refresh()
}

async function eliminar(item: ItemFlat) {
  if (!confirm('Esto desactivará el producto evitando que clientes lo vean, ¿estás seguro?')) return
  try {
    if (item.tipo === 'juego') await removeJuego(item.id)
    else await removeConsola(item.id)
    await refresh()
  } catch (e: any) {
    alert(e?.data?.message ?? 'Error al eliminar')
  }
}

async function reactivar(item: ItemFlat) {
  try {
    if (item.tipo === 'juego') await restoreJuego(item.id)
    else await restoreConsola(item.id)
    await refresh()
  } catch (e: any) {
    alert(e?.data?.message ?? 'Error al reactivar')
  }
}

const inputClass = 'bg-bg-card border border-border text-sm text-fg rounded px-3 py-2 focus:outline-none focus:border-acento-1 transition-colors'
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-8 gap-4 flex-wrap">
      <div>
        <h1 class="text-3xl font-black tracking-tight mb-1">Productos</h1>
        <p class="text-muted text-sm">Gestionar juegos y consolas del inventario.</p>
      </div>
      <button
        class="px-4 py-2 text-sm font-bold text-acento-1 border border-acento-1 hover:bg-acento-1 hover:text-bg-hard rounded transition-colors"
        @click="abrirNuevo"
      >
        + Nuevo producto
      </button>
    </div>

    <div class="flex flex-wrap gap-3 mb-6">
      <input v-model="busqueda" placeholder="Buscar por nombre..." :class="[inputClass, 'w-64']" />
      <input v-model="busquedaSku" placeholder="Buscar por SKU..." :class="[inputClass, 'w-40']" />
      <select v-model="tipoFiltro" :class="inputClass">
        <option value="">Todos los tipos</option>
        <option value="juego">Juegos</option>
        <option value="consola">Consolas</option>
      </select>
      <select v-model="plataformaFiltro" :class="inputClass">
        <option value="">Todas las plataformas</option>
        <option v-for="p in plataformas" :key="p" :value="p">{{ p }}</option>
      </select>
      <select v-model="activoFiltro" :class="inputClass">
        <option value="todos">Todos</option>
        <option value="true">Activos</option>
        <option value="false">Inactivos</option>
      </select>
    </div>

    <div class="hidden md:block">
      <TablaProductos
        :items="items"
        :pending="pending"
        :sort-col="sortCol"
        :sort-dir="sortDir"
        @toggle-sort="toggleSort"
        @editar="abrirEditar"
        @eliminar="eliminar"
        @reactivar="reactivar"
      />
    </div>
    <div class="md:hidden">
      <CardsProductos
        :items="items"
        :pending="pending"
        @editar="abrirEditar"
        @eliminar="eliminar"
        @reactivar="reactivar"
      />
    </div>

    <div v-if="totalPaginas > 1" class="flex items-center justify-center gap-3 mt-6">
      <button
        :disabled="page === 1"
        class="px-3 py-1.5 text-sm border border-border rounded text-muted hover:text-fg disabled:opacity-30 disabled:cursor-not-allowed"
        @click="page--"
      >
        ← Anterior
      </button>
      <span class="text-sm text-muted">Página {{ page }} de {{ totalPaginas }}</span>
      <button
        :disabled="page === totalPaginas"
        class="px-3 py-1.5 text-sm border border-border rounded text-muted hover:text-fg disabled:opacity-30 disabled:cursor-not-allowed"
        @click="page++"
      >
        Siguiente →
      </button>
    </div>

    <FormProducto
      v-if="modalAbierto"
      :item="itemEditando"
      @close="cerrarModal"
      @saved="onSaved"
    />
  </div>
</template>
