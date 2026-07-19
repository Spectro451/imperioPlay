export interface TierConfig {
  tier: number
  valor: number
}

export function useTierConfigApi() {
  const api = useApi()

  async function getAll() {
    return api<TierConfig[]>('/tier-config')
  }

  async function create(payload: TierConfig) {
    return api<TierConfig>('/tier-config', { method: 'POST', body: payload })
  }

  async function update(tier: number, valor: number) {
    return api<TierConfig>(`/tier-config/${tier}`, { method: 'PATCH', body: { valor } })
  }

  async function remove(tier: number) {
    return api<void>(`/tier-config/${tier}`, { method: 'DELETE' })
  }

  return { getAll, create, update, remove }
}
