export function formatearPrecio(n: number): string {
  const entero = Math.trunc(Math.abs(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return n < 0 ? `-${entero}` : entero
}
