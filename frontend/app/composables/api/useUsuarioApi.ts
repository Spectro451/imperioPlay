export interface Usuario {
  id: number
  nombre: string
  correo: string
  rol: 'cliente' | 'empleado' | 'admin'
  isActive: boolean
  rut?: string
}

export interface CreateEmpleadoPayload {
  nombre: string
  correo: string
  password: string
  rut: string
}

export function useUsuarioApi() {
  const api = useApi()

  async function getAll() {
    return api<Usuario[]>('/usuario')
  }

  async function getEmpleados() {
    return api<Usuario[]>('/usuario/empleados')
  }

  async function getByRut(rut: string) {
    return api<Usuario>(`/usuario/rut/${encodeURIComponent(rut)}`)
  }

  async function createEmpleado(payload: CreateEmpleadoPayload) {
    return api<Usuario>('/usuario/empleado', { method: 'POST', body: payload })
  }

  async function remove(id: number) {
    return api<Usuario>(`/usuario/${id}`, { method: 'DELETE' })
  }

  async function reactivar(id: number) {
    return api<Usuario>(`/usuario/${id}/reactivar`, { method: 'PATCH' })
  }

  return { getAll, getEmpleados, getByRut, createEmpleado, remove, reactivar }
}
