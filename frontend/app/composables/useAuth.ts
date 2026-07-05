export const useAuth = () => {
  const user = useState<{ sub: number; correo: string; rol: string } | null>(
    'auth.user',
    () => null,
  )
  const token = useState<string | null>('auth.token', () => null)

  const isLoggedIn = computed(() => !!user.value)
  const isStaff = computed(
    () => user.value?.rol === 'empleado' || user.value?.rol === 'admin',
  )
  const isAdmin = computed(() => user.value?.rol === 'admin')

  return { user, token, isLoggedIn, isStaff, isAdmin }
}
