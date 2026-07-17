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

export interface UpdateEmpleadoPayload {
  nombre?: string
  correo?: string
  rut?: string
}

export function useUsuarioApi() {
  const api = useApi()

  async function getAll() {
    return api<Usuario[]>('/usuario')
  }

  async function getYo() {
    return api<Usuario>('/usuario/yo')
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

  async function update(id: number, payload: UpdateEmpleadoPayload) {
    return api<Usuario>(`/usuario/${id}`, { method: 'PUT', body: payload })
  }

  async function resetPassword(id: number, newPassword: string) {
    return api<Usuario>(`/usuario/${id}/password-reset`, {
      method: 'PATCH',
      body: { newPassword },
    })
  }

  async function changePassword(id: number, currentPassword: string, newPassword: string) {
    return api<Usuario>(`/usuario/${id}/password`, {
      method: 'PATCH',
      body: { currentPassword, newPassword },
    })
  }

  async function remove(id: number) {
    return api<Usuario>(`/usuario/${id}`, { method: 'DELETE' })
  }

  async function reactivar(id: number) {
    return api<Usuario>(`/usuario/${id}/reactivar`, { method: 'PATCH' })
  }

  return { getAll, getYo, getEmpleados, getByRut, createEmpleado, update, resetPassword, changePassword, remove, reactivar }
}
