export interface IntercambioConfig {
  id: number
  recargo_base: number
  recargo_por_tier: number
}

export function useIntercambioConfigApi() {
  const api = useApi()

  async function get() {
    return api<IntercambioConfig>('/intercambio-config')
  }

  async function update(payload: Partial<Omit<IntercambioConfig, 'id'>>) {
    return api<IntercambioConfig>('/intercambio-config', { method: 'PATCH', body: payload })
  }

  return { get, update }
}
