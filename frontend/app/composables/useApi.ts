export function useApi() {
  const config = useRuntimeConfig()
  const { token } = useAuth()

  const baseURL = import.meta.server
    ? config.apiBaseServer
    : config.public.apiBase

  return $fetch.create({
    baseURL,
    onRequest({ options }) {
      if (token.value) {
        options.headers = {
          ...options.headers as Record<string, string>,
          Authorization: `Bearer ${token.value}`,
        }
      }
    },
  })
}
