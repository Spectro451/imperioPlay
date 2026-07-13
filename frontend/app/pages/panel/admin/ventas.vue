<script setup lang="ts">
import type { FiltroVentasParams, OrdenVentas } from '~/composables/api/useVentaApi'
import type { SortCol, SortDir } from '~/components/venta/TablaVentas.vue'

definePageMeta({ middleware: 'admin', layout: 'panel' })

const { getAll } = useVentaApi()
const { getAll: getUsuarios } = useUsuarioApi()

const filtros = ref<FiltroVentasParams>({ page: 1, limit: 20 })
const sortCol = ref<SortCol>('fecha')
const sortDir = ref<SortDir>('desc')

const orden = computed<OrdenVentas>(() => `${sortCol.value}-${sortDir.value}` as OrdenVentas)

const DIR_INICIAL: SortDir = 'desc'

function toggleSort(col: SortCol) {
  if (sortCol.value !== col) {
    sortCol.value = col
    sortDir.value = DIR_INICIAL
    return
  }
  if (sortDir.value === DIR_INICIAL) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortCol.value = 'fecha'
    sortDir.value = 'desc'
  }
}

const params = computed<FiltroVentasParams>(() => ({
  ...filtros.value,
  orden: orden.value,
}))

watch(
  () => [filtros.value.desde, filtros.value.hasta, filtros.value.vendedor_id, filtros.value.metodo_pago, orden.value],
  () => { filtros.value.page = 1 },
  { flush: 'sync' },
)

const { data: usuariosData } = await useAsyncData(
  'admin-ventas-vendedores',
  () => getUsuarios(),
)
const vendedores = computed(
  () => (usuariosData.value ?? []).filter(u => u.rol === 'empleado' || u.rol === 'admin'),
)

const { data, pending } = await useAsyncData(
  'admin-ventas-listado',
  () => getAll(params.value),
  { watch: [params] },
)

const ventas = computed(() => data.value?.ventas ?? [])
const totalPaginas = computed(() => data.value?.totalPaginas ?? 1)
const totalRegistros = computed(() => data.value?.totalRegistros ?? 0)

function limpiarFiltros() {
  filtros.value = { page: 1, limit: 20 }
  sortCol.value = 'fecha'
  sortDir.value = 'desc'
}

function cambiarPagina(nueva: number) {
  filtros.value = { ...filtros.value, page: nueva }
}
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-black tracking-tight mb-1">Ventas realizadas</h1>
      <p class="text-muted text-sm">
        {{ totalRegistros }} venta{{ totalRegistros === 1 ? '' : 's' }} en el historial.
      </p>
    </div>

    <FiltrosVentas
      v-model="filtros"
      :vendedores="vendedores"
      @limpiar="limpiarFiltros"
    />

    <div class="hidden md:block">
      <TablaVentas
        :ventas="ventas"
        :pending="pending"
        :sort-col="sortCol"
        :sort-dir="sortDir"
        @toggle-sort="toggleSort"
      />
    </div>
    <div class="md:hidden">
      <CardsVentas :ventas="ventas" :pending="pending" />
    </div>

    <div v-if="totalPaginas > 1" class="flex items-center justify-center gap-3 mt-6">
      <button
        :disabled="(filtros.page ?? 1) === 1"
        class="px-3 py-1.5 text-sm border border-border rounded text-muted hover:text-fg disabled:opacity-30 disabled:cursor-not-allowed"
        @click="cambiarPagina((filtros.page ?? 1) - 1)"
      >
        ← Anterior
      </button>
      <span class="text-sm text-muted">Página {{ filtros.page ?? 1 }} de {{ totalPaginas }}</span>
      <button
        :disabled="(filtros.page ?? 1) === totalPaginas"
        class="px-3 py-1.5 text-sm border border-border rounded text-muted hover:text-fg disabled:opacity-30 disabled:cursor-not-allowed"
        @click="cambiarPagina((filtros.page ?? 1) + 1)"
      >
        Siguiente →
      </button>
    </div>
  </div>
</template>
