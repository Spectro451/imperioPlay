<script setup lang="ts">
import type { ItemFlat } from '~/composables/useProductoTypes'

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

type SortCol = 'id' | 'nombre' | 'stock' | 'precio'
type SortDir = 'asc' | 'desc'
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

function tieneOferta(item: ItemFlat): boolean {
  return (item.descuento_porcentaje ?? 0) > 0 || (item.descuento_fijo ?? 0) > 0
}

function stockClass(stock: number): string {
  if (stock <= 1) return 'text-danger'
  if (stock <= 5) return 'text-warning'
  return ''
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

    <div class="hidden md:block bg-bg-card border border-border rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-bg-hard border-b border-border">
            <tr class="text-left text-xs uppercase tracking-widest text-muted">
              <th class="px-4 py-3 font-bold">
                <button
                  class="inline-flex items-center gap-1 hover:text-fg transition-colors"
                  :class="sortCol === 'nombre' && 'text-fg'"
                  @click="toggleSort('nombre')"
                >
                  Nombre
                  <span class="text-[10px]">{{ sortCol === 'nombre' ? (sortDir === 'asc' ? '▲' : '▼') : '↕' }}</span>
                </button>
              </th>
              <th class="px-4 py-3 font-bold">SKU</th>
              <th class="px-4 py-3 font-bold">Tipo</th>
              <th class="px-4 py-3 font-bold">Plataforma</th>
              <th class="px-4 py-3 font-bold">Estado</th>
              <th class="px-4 py-3 font-bold text-right">
                <button
                  class="inline-flex items-center gap-1 hover:text-fg transition-colors"
                  :class="sortCol === 'stock' && 'text-fg'"
                  @click="toggleSort('stock')"
                >
                  Stock
                  <span class="text-[10px]">{{ sortCol === 'stock' ? (sortDir === 'asc' ? '▲' : '▼') : '↕' }}</span>
                </button>
              </th>
              <th class="px-4 py-3 font-bold text-right">
                <button
                  class="inline-flex items-center gap-1 hover:text-fg transition-colors"
                  :class="sortCol === 'precio' && 'text-fg'"
                  @click="toggleSort('precio')"
                >
                  Precio
                  <span class="text-[10px]">{{ sortCol === 'precio' ? (sortDir === 'asc' ? '▲' : '▼') : '↕' }}</span>
                </button>
              </th>
              <th class="px-4 py-3 font-bold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="pending">
              <SkeletonProductosFilas />
            </template>
            <template v-else-if="!items.length">
              <tr>
                <td colspan="8" class="px-4 py-16 text-center text-muted">Sin resultados.</td>
              </tr>
            </template>
            <template v-else>
            <tr
              v-for="item in items"
              :key="`${item.tipo}-${item.id}`"
              class="border-b border-border last:border-b-0 hover:bg-bg-hard/50 transition-colors"
              :class="!item.isActive && 'opacity-50'"
            >
              <td class="px-4 py-3 font-medium">{{ item.nombre }}</td>
              <td class="px-4 py-3 text-muted font-mono text-xs">{{ item.sku || '—' }}</td>
              <td class="px-4 py-3 capitalize text-muted">{{ item.tipo }}</td>
              <td class="px-4 py-3">{{ item.plataforma }}</td>
              <td class="px-4 py-3 capitalize">{{ item.estado }}</td>
              <td class="px-4 py-3 text-right font-bold" :class="stockClass(item.stock)">{{ item.stock }}</td>
              <td class="px-4 py-3 text-right">
                <div class="flex flex-col items-end leading-tight">
                  <span
                    v-if="tieneOferta(item)"
                    class="text-xs text-muted line-through"
                  >
                    ${{ item.precio_base.toLocaleString('es-AR') }}
                  </span>
                  <span class="font-bold text-acento-1">
                    ${{ item.precio_final.toLocaleString('es-AR') }}
                  </span>
                  <span
                    v-if="tieneOferta(item)"
                    class="text-[10px] font-bold text-muted uppercase tracking-wider"
                  >
                    {{ item.descuento_porcentaje ? `-${item.descuento_porcentaje}%` : `-$${item.descuento_fijo?.toLocaleString('es-AR')}` }}
                  </span>
                </div>
              </td>
              <td class="px-4 py-3 text-right">
                <div class="flex gap-2 justify-end">
                  <button
                    class="text-xs text-muted hover:text-acento-1 transition-colors"
                    @click="abrirEditar(item)"
                  >
                    Editar
                  </button>
                  <button
                    v-if="item.isActive"
                    class="text-xs text-muted hover:text-red-500 transition-colors"
                    @click="eliminar(item)"
                  >
                    Eliminar
                  </button>
                  <button
                    v-else
                    class="text-xs text-muted hover:text-acento-1 transition-colors"
                    @click="reactivar(item)"
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

    <div class="md:hidden flex flex-col gap-3">
      <template v-if="pending">
        <SkeletonProductosCards />
      </template>
      <template v-else-if="!items.length">
        <p class="bg-bg-card border border-border rounded-lg p-6 text-center text-muted text-sm">
          Sin resultados.
        </p>
      </template>
      <template v-else>
      <div
        v-for="item in items"
        :key="`card-${item.tipo}-${item.id}`"
        class="bg-bg-card border border-border rounded-lg p-4 flex flex-col gap-3"
        :class="!item.isActive && 'opacity-50'"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0 flex-1">
            <p class="font-bold truncate">{{ item.nombre }}</p>
            <p class="text-xs text-muted capitalize mt-0.5">
              {{ item.tipo }} · {{ item.plataforma }} · {{ item.estado }}
            </p>
            <p v-if="item.sku" class="text-[10px] text-muted font-mono mt-0.5">SKU: {{ item.sku }}</p>
          </div>
          <div class="flex flex-col items-end shrink-0 leading-tight">
            <span
              v-if="tieneOferta(item)"
              class="text-xs text-muted line-through"
            >
              ${{ item.precio_base.toLocaleString('es-AR') }}
            </span>
            <span class="text-base font-bold text-acento-1">
              ${{ item.precio_final.toLocaleString('es-AR') }}
            </span>
            <span
              v-if="tieneOferta(item)"
              class="text-[10px] font-bold text-muted uppercase tracking-wider"
            >
              {{ item.descuento_porcentaje ? `-${item.descuento_porcentaje}%` : `-$${item.descuento_fijo?.toLocaleString('es-AR')}` }}
            </span>
          </div>
        </div>

        <div class="flex items-center justify-between text-xs">
          <span class="text-muted">
            Stock: <span class="font-bold" :class="stockClass(item.stock) || 'text-fg'">{{ item.stock }}</span>
          </span>
          <div class="flex gap-4">
            <button
              class="text-muted hover:text-acento-1 transition-colors"
              @click="abrirEditar(item)"
            >
              Editar
            </button>
            <button
              v-if="item.isActive"
              class="text-muted hover:text-red-500 transition-colors"
              @click="eliminar(item)"
            >
              Eliminar
            </button>
            <button
              v-else
              class="text-muted hover:text-acento-1 transition-colors"
              @click="reactivar(item)"
            >
              Reactivar
            </button>
          </div>
        </div>
      </div>
      </template>
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
