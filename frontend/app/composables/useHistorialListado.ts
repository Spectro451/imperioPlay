import type { FiltroHistorialBase } from '~/components/panel/FiltrosHistorial.vue'

interface FiltroPaginado<TOrden extends string> extends FiltroHistorialBase {
  page?: number
  limit?: number
  orden?: TOrden
}

interface Opciones<TFiltro extends FiltroPaginado<TOrden>, TOrden extends string, TSortCol extends string, TResp> {
  key: string
  fetcher: (params: TFiltro) => Promise<TResp>
  defaultFiltros: TFiltro
  defaultSortCol: TSortCol
  ascCols?: TSortCol[]
  buildOrden: (col: TSortCol, dir: 'asc' | 'desc') => TOrden
}

const WATCH_KEYS: Array<keyof FiltroHistorialBase> = ['desde', 'hasta', 'vendedor_id', 'metodo_pago']

export function useHistorialListado<
  TFiltro extends FiltroPaginado<TOrden>,
  TOrden extends string,
  TSortCol extends string,
  TResp,
>(opciones: Opciones<TFiltro, TOrden, TSortCol, TResp>) {
  const filtros = ref({ ...opciones.defaultFiltros }) as Ref<TFiltro>
  const { sortCol, sortDir, toggleSort } = useTriStateSort<TSortCol>({
    defaultCol: opciones.defaultSortCol,
    ascCols: opciones.ascCols,
  })

  const orden = computed<TOrden>(() => opciones.buildOrden(sortCol.value, sortDir.value))
  const params = computed<TFiltro>(() => ({ ...filtros.value, orden: orden.value }))

  watch(
    () => [...WATCH_KEYS.map(k => filtros.value[k]), orden.value],
    () => { filtros.value.page = 1 },
    { flush: 'sync' },
  )

  const { data, pending } = useAsyncData<TResp>(
    opciones.key,
    () => opciones.fetcher(params.value),
    { watch: [params], lazy: true },
  )

  function limpiarFiltros() {
    filtros.value = { ...opciones.defaultFiltros }
    sortCol.value = opciones.defaultSortCol
    sortDir.value = opciones.ascCols?.includes(opciones.defaultSortCol) ? 'asc' : 'desc'
  }

  function cambiarPagina(nueva: number) {
    filtros.value = { ...filtros.value, page: nueva }
  }

  return {
    filtros,
    sortCol,
    sortDir,
    toggleSort,
    data,
    pending,
    limpiarFiltros,
    cambiarPagina,
  }
}
