export interface ItemFlat {
  id: number
  nombre: string
  sku?: string
  tipo: 'juego' | 'consola'
  plataforma: string
  estado: string
  precio_final: number
  precio_base: number
  descuento_porcentaje?: number
  descuento_fijo?: number
  fotos?: string[]
  stock: number
  isActive: boolean
}

export interface FiltrosApi {
  nombre?: string
  sku?: string
  consola?: string
  estado?: string
  orden?: string
  page?: number
  limit?: number
  activo?: 'true' | 'false' | 'todos'
}
