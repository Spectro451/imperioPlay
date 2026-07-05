import type { ItemFlat } from './useProductoTypes'

const PAGE_SIZE = 20

export function useCatalogo(allItems: ItemFlat[]) {
  const filtros = reactive({
    busqueda: '',
    plataforma: '',
    estado: '',
    orden: 'id-desc',
  })

  const page = ref(1)

  watch(filtros, () => { page.value = 1 })

  const filtered = computed(() => {
    let result = allItems

    if (filtros.busqueda) {
      const q = filtros.busqueda.toLowerCase()
      result = result.filter(p => p.nombre.toLowerCase().includes(q))
    }
    if (filtros.plataforma)
      result = result.filter(p => p.plataforma === filtros.plataforma)

    if (filtros.estado)
      result = result.filter(p => p.estado === filtros.estado)

    if (filtros.orden === 'precio-asc')
      result = [...result].sort((a, b) => a.precio_final - b.precio_final)
    else if (filtros.orden === 'precio-desc')
      result = [...result].sort((a, b) => b.precio_final - a.precio_final)
    else if (filtros.orden === 'abc')
      result = [...result].sort((a, b) => a.nombre.localeCompare(b.nombre))
    else
      result = [...result].sort((a, b) => b.id - a.id)

    return result
  })

  const items = computed(() =>
    filtered.value.slice((page.value - 1) * PAGE_SIZE, page.value * PAGE_SIZE)
  )

  const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / PAGE_SIZE)))

  return { filtros, page, items, totalPages }
}
