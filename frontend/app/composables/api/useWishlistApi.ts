export interface WishlistItem {
  id: number
  usuarioId: number
  juegoId: number | null
  consolaId: number | null
  createdAt: string
  juego?: any
  consola?: any
}

export interface WishlistIds {
  juegos: Record<number, number>
  consolas: Record<number, number>
}

export function useWishlistApi() {
  const api = useApi()

  async function getAll() {
    return api<WishlistItem[]>('/wishlist')
  }

  async function getIds() {
    return api<WishlistIds>('/wishlist/ids')
  }

  async function add(payload: { juegoId?: number; consolaId?: number }) {
    return api<WishlistItem>('/wishlist', { method: 'POST', body: payload })
  }

  async function remove(id: number) {
    return api<void>(`/wishlist/${id}`, { method: 'DELETE' })
  }

  return { getAll, getIds, add, remove }
}
