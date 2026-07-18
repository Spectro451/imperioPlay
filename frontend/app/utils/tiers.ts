export const VALOR_TIER = {
  1: 10000,
  2: 20000,
  3: 35000,
} as const

const UMBRALES_TIER: Array<[number, number]> = [
  [10000, 1],
  [20000, 2],
  [35000, 3],
]

export function calcularTier(precioFinal: number): number {
  for (const [tope, tier] of UMBRALES_TIER) {
    if (precioFinal <= tope) return tier
  }
  return UMBRALES_TIER[UMBRALES_TIER.length - 1]![1]
}

const TIER_MAX = Math.max(...Object.keys(VALOR_TIER).map(Number))

export interface ResultadoFaltante {
  cumple: boolean
  faltanteTier: number
  dineroExtra: number
}

export function calcularFaltante(totalSolicitado: number, totalCliente: number): ResultadoFaltante {
  const faltanteTier = totalSolicitado - totalCliente
  if (faltanteTier <= 0) return { cumple: true, faltanteTier: 0, dineroExtra: 0 }
  const dineroExtra = faltanteTier <= TIER_MAX
    ? VALOR_TIER[faltanteTier as keyof typeof VALOR_TIER]
    : VALOR_TIER[TIER_MAX as keyof typeof VALOR_TIER] + 15000 + (faltanteTier - TIER_MAX - 1) * 5000
  return { cumple: false, faltanteTier, dineroExtra }
}
