import {
  calcularFaltante,
  calcularTier,
  type RecargosIntercambio,
  type ResultadoFaltante,
  type ValoresTier,
} from '~/utils/tiers'

interface CacheEstado {
  valoresTier: ValoresTier
  recargos: RecargosIntercambio
}

const RECARGOS_VACIOS: RecargosIntercambio = { recargo_base: 0, recargo_por_tier: 0 }

export function useTierConfigCache() {
  const estado = useState<CacheEstado | null>('tier-config-cache', () => null)

  async function cargar(force = false): Promise<void> {
    if (estado.value && !force) return
    const tierApi = useTierConfigApi()
    const intercambioApi = useIntercambioConfigApi()
    const [tiers, config] = await Promise.all([tierApi.getAll(), intercambioApi.get()])
    estado.value = {
      valoresTier: Object.fromEntries(tiers.map(t => [t.tier, t.valor])),
      recargos: {
        recargo_base: config.recargo_base,
        recargo_por_tier: config.recargo_por_tier,
      },
    }
  }

  const valoresTier = computed<ValoresTier>(() => estado.value?.valoresTier ?? {})
  const recargos = computed<RecargosIntercambio>(() => estado.value?.recargos ?? RECARGOS_VACIOS)

  function tierDe(precioFinal: number): number {
    return calcularTier(precioFinal, valoresTier.value)
  }

  function faltanteDe(totalSolicitado: number, totalCliente: number): ResultadoFaltante {
    return calcularFaltante(totalSolicitado, totalCliente, valoresTier.value, recargos.value)
  }

  return { valoresTier, recargos, cargar, tierDe, faltanteDe }
}
