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
  const busquedaDebounced = ref('')

  watch(
    () => filtros.busqueda,
    (val) => {
      const timer = setTimeout(() => { busquedaDebounced.value = val }, 350)
      return () => clearTimeout(timer)
    },
  )

  const params = computed<FiltrosApi>(() => ({
    nombre: busquedaDebounced.value || undefined,
    consola: filtros.plataforma || undefined,
    estado: filtros.estado || undefined,
    orden: filtros.orden,
    page: page.value,
  }))

  watch(
    () => [busquedaDebounced.value, filtros.plataforma, filtros.estado, filtros.orden],
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

  const { data, pending } = await useAsyncData(
    `catalogo-${tipo ?? 'todos'}${esOfertas ? '-ofertas' : ''}`,
    () => fetchFn(params.value),
    { watch: [params] },
  )

  return {
    filtros,
    page,
    items: computed(() => data.value?.items ?? []),
    totalPages: computed(() => data.value?.totalPaginas ?? 1),
    pending,
  }
}
