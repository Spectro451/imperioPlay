export interface Usuario {
  id: number
  nombre: string
  correo: string
  rol: 'cliente' | 'empleado' | 'admin'
  isActive: boolean
}

export function useUsuarioApi() {
  const api = useApi()

  async function getAll() {
    return api<Usuario[]>('/usuario')
  }

  return { getAll }
}
