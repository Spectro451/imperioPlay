<script setup lang="ts">
import type { FiltroVentasParams, OrdenVentas, RespuestaListadoVentas } from '~/composables/api/useVentaApi'
import type { SortCol } from '~/components/venta/TablaVentas.vue'

definePageMeta({ middleware: 'admin', layout: 'panel' })

const { getAll } = useVentaApi()

const { filtros, sortCol, sortDir, toggleSort, data, pending, limpiarFiltros, cambiarPagina } =
  useHistorialListado<FiltroVentasParams, OrdenVentas, SortCol, RespuestaListadoVentas>({
    key: 'admin-ventas-listado',
    fetcher: params => getAll(params),
    defaultFiltros: { page: 1, limit: 20 },
    defaultSortCol: 'fecha',
    buildOrden: (col, dir) => `${col}-${dir}` as OrdenVentas,
  })

const { vendedores } = useVendedoresCache()

const ventas = computed(() => data.value?.ventas ?? [])
const totalPaginas = computed(() => data.value?.totalPaginas ?? 1)
const totalRegistros = computed(() => data.value?.totalRegistros ?? 0)
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-black tracking-tight mb-1">Ventas realizadas</h1>
      <p class="text-muted text-sm">
        {{ totalRegistros }} venta{{ totalRegistros === 1 ? '' : 's' }} en el historial.
      </p>
    </div>

    <FiltrosHistorial
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

    <PanelPaginacion
      :page="filtros.page ?? 1"
      :total-paginas="totalPaginas"
      @update:page="cambiarPagina"
    />
  </div>
</template>
