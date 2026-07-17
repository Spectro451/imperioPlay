<script setup lang="ts">
import type { ItemFlat } from '~/composables/useProductoTypes'
import type { SortCol } from '~/components/panel/TablaProductos.vue'

definePageMeta({ middleware: 'panel', layout: 'panel' })

const { getAll } = useProductoApi()
const { remove: removeJuego, restore: restoreJuego } = useJuegoApi()
const { remove: removeConsola, restore: restoreConsola } = useConsolaApi()
const { notificar } = useNotify()

const busqueda = ref('')
const busquedaSku = ref('')
const tipoFiltro = ref('')
const plataformaFiltro = ref('')
const activoFiltro = ref<'todos' | 'true' | 'false'>('todos')
const page = ref(1)

const { sortCol, sortDir, toggleSort } = useTriStateSort<SortCol>({
  defaultCol: 'id',
  ascCols: ['nombre'],
})

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

const busquedaDebounced = useDebouncedRef(busqueda)
const busquedaSkuDebounced = useDebouncedRef(busquedaSku)

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
    notificar('error', e?.data?.message ?? 'Error al eliminar')
  }
}

async function reactivar(item: ItemFlat) {
  try {
    if (item.tipo === 'juego') await restoreJuego(item.id)
    else await restoreConsola(item.id)
    await refresh()
  } catch (e: any) {
    notificar('error', e?.data?.message ?? 'Error al reactivar')
  }
}
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
      <PanelInput v-model="busqueda" placeholder="Buscar por nombre..." class="w-64" />
      <PanelInput v-model="busquedaSku" placeholder="Buscar por SKU..." class="w-40" />
      <PanelSelect v-model="tipoFiltro">
        <option value="">Todos los tipos</option>
        <option value="juego">Juegos</option>
        <option value="consola">Consolas</option>
      </PanelSelect>
      <PanelSelect v-model="plataformaFiltro">
        <option value="">Todas las plataformas</option>
        <option v-for="p in plataformas" :key="p" :value="p">{{ p }}</option>
      </PanelSelect>
      <PanelSelect v-model="activoFiltro">
        <option value="todos">Todos</option>
        <option value="true">Activos</option>
        <option value="false">Inactivos</option>
      </PanelSelect>
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

    <PanelPaginacion v-model:page="page" :total-paginas="totalPaginas" />

    <FormProducto
      v-if="modalAbierto"
      :item="itemEditando"
      @close="cerrarModal"
      @saved="onSaved"
    />
  </div>
</template>
