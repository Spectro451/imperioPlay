import type { ItemFlat } from './useProductoTypes'
import { aplanarVariantes } from '~/utils/variantes'

interface Opciones {
  filtroTipo?: ItemFlat['tipo']
  onSeleccionar: (producto: any, plataforma?: string) => void
}

export function useElegirProducto(opciones: Opciones) {
  const { buscarTodosPorNombreExacto } = useProductoApi()
  const variantesModal = ref<ItemFlat[] | null>(null)
  const productosCache = ref<any[]>([])

  async function buscarPorNombre(nombre: string) {
    let productos = await buscarTodosPorNombreExacto(nombre)
    if (opciones.filtroTipo) {
      productos = productos.filter(p => p.tipo === opciones.filtroTipo)
    }
    if (!productos.length) return
    if (productos.length === 1) {
      opciones.onSeleccionar(productos[0])
      return
    }
    productosCache.value = productos
    let variantes = productos.flatMap(aplanarVariantes)
    if (opciones.filtroTipo) {
      variantes = variantes.filter(v => v.tipo === opciones.filtroTipo)
    }
    if (variantes.length <= 1) {
      opciones.onSeleccionar(productos[0])
      return
    }
    variantesModal.value = variantes
  }

  function onVarianteElegida(v: ItemFlat) {
    const prod = productosCache.value.find(p => p.sku === v.sku)
    if (prod) opciones.onSeleccionar(prod, v.plataforma)
    variantesModal.value = null
  }

  return { variantesModal, buscarPorNombre, onVarianteElegida }
}
