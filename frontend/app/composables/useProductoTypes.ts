export interface ItemFlat {
  id: number
  nombre: string
  tipo: 'juego' | 'consola'
  plataforma: string
  estado: string
  precio_final: number
  precio_base: number
  descuento_porcentaje?: number
  descuento_fijo?: number
  fotos?: string[]
  stock: number
}
