export default defineNuxtPlugin(async () => {
  const { refresh, user } = useAuth()
  await refresh()
  if (user.value?.rol === 'cliente') {
    await useWishlist().cargar()
  }
})
