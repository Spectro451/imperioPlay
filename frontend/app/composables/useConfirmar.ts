export function useConfirmar<T = true>() {
  const payload = ref<T | null>(null)
  const loading = ref(false)
  let resolver: ((v: boolean) => void) | null = null

  function abrir(data?: T): Promise<boolean> {
    payload.value = (data ?? true) as T
    return new Promise((r) => { resolver = r })
  }

  function cerrar() {
    if (payload.value === null) return
    payload.value = null
    resolver?.(false)
    resolver = null
  }

  async function confirmar(fn?: (data: T) => unknown | Promise<unknown>): Promise<void> {
    if (payload.value === null) return
    if (fn) {
      loading.value = true
      try {
        await fn(payload.value as T)
      } catch {
        loading.value = false
        return
      }
      loading.value = false
    }
    const r = resolver
    resolver = null
    payload.value = null
    r?.(true)
  }

  return reactive({ payload, loading, abrir, cerrar, confirmar })
}
