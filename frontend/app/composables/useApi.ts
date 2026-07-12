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
  })
}
