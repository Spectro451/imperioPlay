type SessionUser = { id: number; correo: string; rol: string; nombre: string }

export const useAuth = () => {
  const user = useState<SessionUser | null>('auth.user', () => null)

  const isLoggedIn = computed(() => !!user.value)
  const isStaff = computed(
    () => user.value?.rol === 'empleado' || user.value?.rol === 'admin',
  )
  const isAdmin = computed(() => user.value?.rol === 'admin')

  async function refresh() {
    try {
      const api = useApi()
      user.value = await api<SessionUser>('/auth/me')
    } catch {
      user.value = null
    }
  }

  async function logout() {
    try {
      const api = useApi()
      await api('/auth/logout', { method: 'POST' })
    } finally {
      user.value = null
      await navigateTo('/')
    }
  }

  return { user, isLoggedIn, isStaff, isAdmin, refresh, logout }
}
