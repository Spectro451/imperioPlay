import type { Usuario } from './api/useUsuarioApi'

const CACHE_KEY = 'vendedores-cache'

export function useVendedoresCache() {
  const { getEmpleados } = useUsuarioApi()
  const { data, pending, refresh, error } = useAsyncData<Usuario[]>(
    CACHE_KEY,
    () => getEmpleados(),
    { lazy: true, default: () => [] },
  )
  return { vendedores: data, pending, refresh, error }
}

export function invalidarVendedoresCache() {
  return refreshNuxtData(CACHE_KEY)
}
