export default defineNuxtRouteMiddleware(() => {
  const { user } = useAuth()
  if (!user.value) return navigateTo('/login')
  if (user.value.rol !== 'cliente') return navigateTo('/')
})
