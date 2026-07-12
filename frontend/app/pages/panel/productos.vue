<script setup lang="ts">
import type { ItemFlat } from '~/composables/useProductoTypes'

definePageMeta({ middleware: 'panel', layout: 'panel' })

const { getAll } = useProductoApi()
const { remove: removeJuego } = useJuegoApi()
const { remove: removeConsola } = useConsolaApi()

const busqueda = ref('')
const tipoFiltro = ref('')
const plataformaFiltro = ref('')
const page = ref(1)

const busquedaDebounced = ref('')
let debounceTimer: ReturnType<typeof setTimeout> | null = null
watch(busqueda, (val) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => { busquedaDebounced.value = val }, 350)
})

const params = computed(() => ({
  nombre: busquedaDebounced.value || undefined,
  consola: plataformaFiltro.value || undefined,
  tipo: tipoFiltro.value || undefined,
  page: page.value,
  orden: 'id-desc',
}))

watch(() => [busquedaDebounced.value, tipoFiltro.value, plataformaFiltro.value], () => {
  page.value = 1
}, { flush: 'sync' })

const { data, pending, refresh } = await useAsyncData(
  'panel-productos',
  () => getAll(params.value),
  { watch: [params], getCachedData: () => undefined },
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
  if (!confirm(`¿Eliminar ${item.tipo} "${item.nombre}" (${item.plataforma} ${item.estado})?`)) return
  try {
    if (item.tipo === 'juego') await removeJuego(item.id)
    else await removeConsola(item.id)
    await refresh()
  } catch (e: any) {
    alert(e?.data?.message ?? 'Error al eliminar')
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
      <select v-model="tipoFiltro" :class="inputClass">
        <option value="">Todos los tipos</option>
        <option value="juego">Juegos</option>
        <option value="consola">Consolas</option>
      </select>
      <select v-model="plataformaFiltro" :class="inputClass">
        <option value="">Todas las plataformas</option>
        <option v-for="p in plataformas" :key="p" :value="p">{{ p }}</option>
      </select>
    </div>

    <div class="hidden md:block bg-bg-card border border-border rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-bg-hard border-b border-border">
            <tr class="text-left text-xs uppercase tracking-widest text-muted">
              <th class="px-4 py-3 font-bold">Nombre</th>
              <th class="px-4 py-3 font-bold">Tipo</th>
              <th class="px-4 py-3 font-bold">Plataforma</th>
              <th class="px-4 py-3 font-bold">Estado</th>
              <th class="px-4 py-3 font-bold text-right">Stock</th>
              <th class="px-4 py-3 font-bold text-right">Precio</th>
              <th class="px-4 py-3 font-bold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="pending" class="border-b border-border">
              <td colspan="7" class="px-4 py-8 text-center text-muted">Cargando...</td>
            </tr>
            <tr v-else-if="!items.length">
              <td colspan="7" class="px-4 py-8 text-center text-muted">Sin resultados.</td>
            </tr>
            <tr
              v-for="item in items"
              v-else
              :key="`${item.tipo}-${item.id}`"
              class="border-b border-border last:border-b-0 hover:bg-bg-hard/50 transition-colors"
            >
              <td class="px-4 py-3 font-medium">{{ item.nombre }}</td>
              <td class="px-4 py-3 capitalize text-muted">{{ item.tipo }}</td>
              <td class="px-4 py-3">{{ item.plataforma }}</td>
              <td class="px-4 py-3 capitalize">{{ item.estado }}</td>
              <td class="px-4 py-3 text-right" :class="item.stock === 0 && 'text-red-500'">{{ item.stock }}</td>
              <td class="px-4 py-3 text-right font-bold text-acento-1">
                ${{ item.precio_final.toLocaleString('es-AR') }}
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
                    class="text-xs text-muted hover:text-red-500 transition-colors"
                    @click="eliminar(item)"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="md:hidden flex flex-col gap-3">
      <div v-if="pending" class="bg-bg-card border border-border rounded-lg p-6 text-center text-muted text-sm">
        Cargando...
      </div>
      <div v-else-if="!items.length" class="bg-bg-card border border-border rounded-lg p-6 text-center text-muted text-sm">
        Sin resultados.
      </div>
      <div
        v-for="item in items"
        v-else
        :key="`card-${item.tipo}-${item.id}`"
        class="bg-bg-card border border-border rounded-lg p-4 flex flex-col gap-3"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0 flex-1">
            <p class="font-bold truncate">{{ item.nombre }}</p>
            <p class="text-xs text-muted capitalize mt-0.5">
              {{ item.tipo }} · {{ item.plataforma }} · {{ item.estado }}
            </p>
          </div>
          <p class="text-base font-bold text-acento-1 shrink-0">
            ${{ item.precio_final.toLocaleString('es-AR') }}
          </p>
        </div>

        <div class="flex items-center justify-between text-xs">
          <span :class="item.stock === 0 ? 'text-red-500' : 'text-muted'">
            Stock: <span class="font-semibold text-fg">{{ item.stock }}</span>
          </span>
          <div class="flex gap-4">
            <button
              class="text-muted hover:text-acento-1 transition-colors"
              @click="abrirEditar(item)"
            >
              Editar
            </button>
            <button
              class="text-muted hover:text-red-500 transition-colors"
              @click="eliminar(item)"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
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
