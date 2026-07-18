<script setup lang="ts">
import type { FiltroIntercambiosParams, OrdenIntercambios, RespuestaListadoIntercambios } from '~/composables/api/useIntercambioApi'
import type { SortCol } from '~/components/intercambio/TablaIntercambios.vue'

definePageMeta({ middleware: 'admin', layout: 'panel' })

const { getAll } = useIntercambioApi()

const { filtros, sortCol, sortDir, toggleSort, data, pending, limpiarFiltros, cambiarPagina } =
  useHistorialListado<FiltroIntercambiosParams, OrdenIntercambios, SortCol, RespuestaListadoIntercambios>({
    key: 'admin-intercambios-listado',
    fetcher: params => getAll(params),
    defaultFiltros: { page: 1, limit: 20 },
    defaultSortCol: 'fecha',
    buildOrden: (col, dir) => `${col}-${dir}` as OrdenIntercambios,
  })

const { vendedores } = useVendedoresCache()

const intercambios = computed(() => data.value?.intercambios ?? [])
const totalPaginas = computed(() => data.value?.totalPaginas ?? 1)
const totalRegistros = computed(() => data.value?.totalRegistros ?? 0)
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-black tracking-tight mb-1">Intercambios realizados</h1>
      <p class="text-muted text-sm">
        {{ totalRegistros }} intercambio{{ totalRegistros === 1 ? '' : 's' }} en el historial.
      </p>
    </div>

    <FiltrosHistorial
      v-model="filtros"
      :vendedores="vendedores"
      @limpiar="limpiarFiltros"
    />

    <div class="hidden md:block">
      <TablaIntercambios
        :intercambios="intercambios"
        :pending="pending"
        :sort-col="sortCol"
        :sort-dir="sortDir"
        @toggle-sort="toggleSort"
      />
    </div>
    <div class="md:hidden">
      <CardsIntercambios :intercambios="intercambios" :pending="pending" />
    </div>

    <PanelPaginacion
      :page="filtros.page ?? 1"
      :total-paginas="totalPaginas"
      @update:page="cambiarPagina"
    />
  </div>
</template>
