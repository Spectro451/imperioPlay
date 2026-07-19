export type ValoresTier = Record<number, number>

export interface RecargosIntercambio {
  recargo_base: number
  recargo_por_tier: number
}

export interface ResultadoFaltante {
  cumple: boolean
  faltanteTier: number
  dineroExtra: number
}

export function calcularTier(precioFinal: number, valoresTier: ValoresTier): number {
  const tiers = Object.entries(valoresTier)
    .map(([tier, valor]) => ({ tier: Number(tier), valor }))
    .sort((a, b) => a.valor - b.valor)

  if (tiers.length === 0) return 0
  for (const t of tiers) {
    if (precioFinal <= t.valor) return t.tier
  }
  return tiers[tiers.length - 1]!.tier
}

export function calcularFaltante(
  totalSolicitado: number,
  totalCliente: number,
  valoresTier: ValoresTier,
  recargos: RecargosIntercambio,
): ResultadoFaltante {
  const faltanteTier = totalSolicitado - totalCliente
  if (faltanteTier <= 0) return { cumple: true, faltanteTier: 0, dineroExtra: 0 }
  const tiers = Object.keys(valoresTier).map(Number)
  const maxTier = tiers.length ? Math.max(...tiers) : 0
  const dineroExtra = faltanteTier <= maxTier
    ? valoresTier[faltanteTier]!
    : valoresTier[maxTier]! + recargos.recargo_base + (faltanteTier - maxTier - 1) * recargos.recargo_por_tier
  return { cumple: false, faltanteTier, dineroExtra }
}
