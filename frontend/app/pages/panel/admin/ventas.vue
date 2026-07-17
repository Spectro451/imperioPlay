<script setup lang="ts">
import type { FiltroVentasParams, OrdenVentas } from '~/composables/api/useVentaApi'
import type { SortCol } from '~/components/venta/TablaVentas.vue'

definePageMeta({ middleware: 'admin', layout: 'panel' })

const { getAll } = useVentaApi()
const { getAll: getUsuarios } = useUsuarioApi()

const filtros = ref<FiltroVentasParams>({ page: 1, limit: 20 })
const { sortCol, sortDir, toggleSort } = useTriStateSort<SortCol>({ defaultCol: 'fecha' })

const orden = computed<OrdenVentas>(() => `${sortCol.value}-${sortDir.value}` as OrdenVentas)

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

    <PanelPaginacion
      :page="filtros.page ?? 1"
      :total-paginas="totalPaginas"
      @update:page="cambiarPagina"
    />
  </div>
</template>
