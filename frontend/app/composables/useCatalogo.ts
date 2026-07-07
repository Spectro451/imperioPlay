import type { FiltrosApi } from './useProductoTypes'

export async function useCatalogo(tipo?: string, esOfertas = false) {
  const { getAll: getAllProducto, getOfertas } = useProductoApi()
  const { getAll: getAllJuegos } = useJuegoApi()
  const { getAll: getAllConsolas } = useConsolaApi()

  const filtros = reactive({
    busqueda: '',
    plataforma: '',
    estado: '',
    orden: 'id-desc',
  })

  const page = ref(1)

  const params = computed<FiltrosApi>(() => ({
    nombre: filtros.busqueda || undefined,
    consola: filtros.plataforma || undefined,
    estado: filtros.estado || undefined,
    orden: filtros.orden,
    page: page.value,
  }))

  watch(
    () => [filtros.busqueda, filtros.plataforma, filtros.estado, filtros.orden],
    () => { page.value = 1 },
    { flush: 'sync' },
  )

  const fetchFn = tipo === 'juego'
    ? (p: FiltrosApi) => getAllJuegos(p)
    : tipo === 'consola'
      ? (p: FiltrosApi) => getAllConsolas(p)
      : esOfertas
        ? (p: FiltrosApi) => getOfertas(p)
        : (p: FiltrosApi) => getAllProducto(p)

  const { data } = await useAsyncData(
    `catalogo-${tipo ?? 'todos'}${esOfertas ? '-ofertas' : ''}`,
    () => fetchFn(params.value),
    { watch: [params] },
  )

  return {
    filtros,
    page,
    items: computed(() => data.value?.items ?? []),
    totalPages: computed(() => data.value?.totalPaginas ?? 1),
  }
}
