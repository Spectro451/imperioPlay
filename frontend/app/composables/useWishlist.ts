import type { WishlistIds } from '~/composables/api/useWishlistApi'

const IDS_VACIOS: WishlistIds = { juegos: {}, consolas: {} }

export function useWishlist() {
  const ids = useState<WishlistIds>('wishlist.ids', () => ({ ...IDS_VACIOS }))
  const cargado = useState<boolean>('wishlist.loaded', () => false)
  const api = useWishlistApi()
  const { user } = useAuth()

  const esCliente = computed(() => user.value?.rol === 'cliente')

  async function cargar(force = false): Promise<void> {
    if (!esCliente.value) {
      ids.value = { ...IDS_VACIOS }
      cargado.value = false
      return
    }
    if (cargado.value && !force) return
    try {
      ids.value = await api.getIds()
      cargado.value = true
    } catch {
      ids.value = { ...IDS_VACIOS }
    }
  }

  function limpiar(): void {
    ids.value = { ...IDS_VACIOS }
    cargado.value = false
  }

  function tieneJuego(juegoId: number): boolean {
    return juegoId in ids.value.juegos
  }

  function tieneConsola(consolaId: number): boolean {
    return consolaId in ids.value.consolas
  }

  function tieneVariante(tipo: 'juego' | 'consola', variantId: number): boolean {
    return tipo === 'juego' ? tieneJuego(variantId) : tieneConsola(variantId)
  }

  async function toggle(
    tipo: 'juego' | 'consola',
    variantId: number,
  ): Promise<boolean> {
    if (!esCliente.value) throw new Error('Solo clientes pueden usar la wishlist')

    const mapa = tipo === 'juego' ? ids.value.juegos : ids.value.consolas
    const existingId = mapa[variantId]

    if (existingId) {
      await api.remove(existingId)
      const nuevo = { ...mapa }
      delete nuevo[variantId]
      ids.value = {
        ...ids.value,
        [tipo === 'juego' ? 'juegos' : 'consolas']: nuevo,
      }
      return false
    }

    const item = await api.add(
      tipo === 'juego' ? { juegoId: variantId } : { consolaId: variantId },
    )
    ids.value = {
      ...ids.value,
      [tipo === 'juego' ? 'juegos' : 'consolas']: {
        ...mapa,
        [variantId]: item.id,
      },
    }
    return true
  }

  return { ids, cargado, esCliente, cargar, limpiar, tieneJuego, tieneConsola, tieneVariante, toggle }
}
