type SessionUser = { id: number; correo: string; rol: string; nombre: string }

export const useAuth = () => {
  const user = useState<SessionUser | null>('auth.user', () => null)

  const isLoggedIn = computed(() => !!user.value)
  const isStaff = computed(
    () => user.value?.rol === 'empleado' || user.value?.rol === 'admin',
  )
  const isAdmin = computed(() => user.value?.rol === 'admin')

  async function refresh() {
    const api = useApi()
    const intentos = import.meta.server ? 3 : 1
    for (let i = 0; i < intentos; i++) {
      try {
        user.value = await api<SessionUser>('/auth/me')
        return
      } catch (err: unknown) {
        const status = (err as { response?: { status?: number }; status?: number })?.response?.status
          ?? (err as { status?: number })?.status
        if (status === 401) {
          user.value = null
          return
        }
        if (i < intentos - 1) {
          await new Promise((r) => setTimeout(r, 300 * (i + 1)))
        }
      }
    }
  }

  async function logout() {
    try {
      const api = useApi()
      await api('/auth/logout', { method: 'POST' })
    } finally {
      user.value = null
      useWishlist().limpiar()
      await navigateTo('/')
    }
  }

  return { user, isLoggedIn, isStaff, isAdmin, refresh, logout }
}
