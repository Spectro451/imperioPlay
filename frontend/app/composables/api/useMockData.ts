import type { ItemFlat } from '../useProductoTypes'

export const mockProductos: ItemFlat[] = [
  // Juegos usados
  {
    id: 1, nombre: 'The Last of Us Part II', tipo: 'juego',
    plataforma: 'PS4', estado: 'usado',
    precio_base: 8500, precio_final: 8500, stock: 3,
  },
  {
    id: 2, nombre: 'Red Dead Redemption 2', tipo: 'juego',
    plataforma: 'PS4', estado: 'usado',
    precio_base: 7000, precio_final: 5600, descuento_porcentaje: 20, stock: 1,
  },
  {
    id: 3, nombre: 'God of War Ragnarök', tipo: 'juego',
    plataforma: 'PS5', estado: 'usado',
    precio_base: 12000, precio_final: 12000, stock: 2,
  },

  // Juegos nuevos
  {
    id: 4, nombre: 'Elden Ring', tipo: 'juego',
    plataforma: 'PS5', estado: 'nuevo',
    precio_base: 15000, precio_final: 15000, stock: 4,
  },
  {
    id: 5, nombre: 'Hogwarts Legacy', tipo: 'juego',
    plataforma: 'Xbox Series X', estado: 'nuevo',
    precio_base: 13000, precio_final: 10400, descuento_porcentaje: 20, stock: 2,
  },
  {
    id: 6, nombre: 'Spider-Man 2', tipo: 'juego',
    plataforma: 'PS5', estado: 'nuevo',
    precio_base: 16000, precio_final: 16000, stock: 5,
  },

  // Consolas usadas
  {
    id: 7, nombre: 'PlayStation 5', tipo: 'consola',
    plataforma: 'Gen 9', estado: 'usado',
    precio_base: 450000, precio_final: 450000, stock: 1,
  },
  {
    id: 8, nombre: 'Xbox Series X', tipo: 'consola',
    plataforma: 'Gen 9', estado: 'usado',
    precio_base: 380000, precio_final: 342000, descuento_porcentaje: 10, stock: 1,
  },
  {
    id: 9, nombre: 'Nintendo Switch', tipo: 'consola',
    plataforma: 'Gen 8', estado: 'usado',
    precio_base: 280000, precio_final: 280000, stock: 2,
  },

  // Consolas nuevas
  {
    id: 10, nombre: 'PlayStation 5 Digital', tipo: 'consola',
    plataforma: 'Gen 9', estado: 'nuevo',
    precio_base: 520000, precio_final: 520000, stock: 3,
  },
  {
    id: 11, nombre: 'Xbox Series S', tipo: 'consola',
    plataforma: 'Gen 9', estado: 'nuevo',
    precio_base: 320000, precio_final: 320000, stock: 4,
  },
  {
    id: 12, nombre: 'Nintendo Switch OLED', tipo: 'consola',
    plataforma: 'Gen 8', estado: 'nuevo',
    precio_base: 350000, precio_final: 350000, stock: 2,
  },
]

export const mockOfertas = mockProductos.filter(
  (p) => (p.descuento_porcentaje ?? 0) > 0 || (p.descuento_fijo ?? 0) > 0,
)
