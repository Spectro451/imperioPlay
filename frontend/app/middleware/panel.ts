export default defineNuxtRouteMiddleware(() => {
  const { isLoggedIn, isStaff } = useAuth()
  if (!isLoggedIn.value) return navigateTo('/login')
  if (!isStaff.value) return navigateTo('/')
})
