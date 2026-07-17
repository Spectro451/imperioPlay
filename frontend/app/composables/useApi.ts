const RUTAS_AUTH_SIN_REDIRECT = ['/auth/me', '/auth/login', '/auth/logout']

export function useApi() {
  const config = useRuntimeConfig()
  const requestHeaders = import.meta.server ? useRequestHeaders(['cookie']) : {}

  const baseURL = import.meta.server
    ? config.apiBaseServer
    : config.public.apiBase

  return $fetch.create({
    baseURL,
    credentials: 'include',
    onRequest({ options }) {
      if (import.meta.server && requestHeaders.cookie) {
        options.headers = {
          ...options.headers as Record<string, string>,
          cookie: requestHeaders.cookie,
        }
      }
    },
    async onResponseError({ response, request }) {
      if (import.meta.server || response.status !== 401) return
      const url = typeof request === 'string' ? request : request.url
      if (RUTAS_AUTH_SIN_REDIRECT.some((r) => url.endsWith(r))) return
      const { user } = useAuth()
      if (!user.value) return
      user.value = null
      await navigateTo('/login')
    },
  })
}
