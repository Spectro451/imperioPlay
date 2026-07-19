<script setup lang="ts">
import type { TierConfig } from '~/composables/api/useTierConfigApi'
import type { IntercambioConfig } from '~/composables/api/useIntercambioConfigApi'

definePageMeta({ middleware: 'admin', layout: 'panel' })

const tierApi = useTierConfigApi()
const intercambioConfigApi = useIntercambioConfigApi()
const { recalcularTiers } = useJuegoApi()
const { notificar } = useNotify()
const { cargar: refrescarCache } = useTierConfigCache()

const btnAcento = 'px-3 py-1 text-sm font-bold text-acento-1 border border-acento-1 hover:bg-acento-1 hover:text-bg-hard rounded transition-colors'
const btnAcentoLg = 'px-4 py-2 text-sm font-bold text-acento-1 border border-acento-1 hover:bg-acento-1 hover:text-bg-hard rounded transition-colors'
const btnDanger = 'px-3 py-1 text-sm font-bold text-danger border border-danger hover:bg-danger hover:text-bg-hard rounded transition-colors'
const btnWarning = 'px-4 py-2 text-sm font-bold text-warning border border-warning hover:bg-warning hover:text-bg-hard rounded transition-colors'

const { data, pending, refresh } = await useAsyncData('tier-config-panel', async () => {
  const [t, c] = await Promise.all([tierApi.getAll(), intercambioConfigApi.get()])
  return { tiers: t, config: c }
})

const tiers = computed<TierConfig[]>(() => data.value?.tiers ?? [])
const config = computed<IntercambioConfig | null>(() => data.value?.config ?? null)

const editValores = ref<Record<number, number>>({})
const editRecargoBase = ref<number | null>(null)
const editRecargoPorTier = ref<number | null>(null)
const valorNuevoTier = ref<number | null>(null)

watchEffect(() => {
  if (!data.value) return
  editValores.value = Object.fromEntries(data.value.tiers.map((t) => [t.tier, t.valor]))
  editRecargoBase.value = data.value.config.recargo_base
  editRecargoPorTier.value = data.value.config.recargo_por_tier
})

const proximoTier = computed(() => {
  if (!tiers.value.length) return 1
  return Math.max(...tiers.value.map((t) => t.tier)) + 1
})

function fallar(e: any, msgFallback: string) {
  notificar('error', e?.data?.message ?? msgFallback)
}

async function ejecutar(accion: () => Promise<void>, msgOk: string, msgError: string) {
  try {
    await accion()
    notificar('ok', msgOk)
    await Promise.all([refresh(), refrescarCache(true)])
  } catch (e: any) {
    fallar(e, msgError)
  }
}

function valorAnteriorDe(tier: number): number | null {
  const anterior = tiers.value.find((t) => t.tier === tier - 1)
  return anterior ? anterior.valor : null
}

function valorSiguienteDe(tier: number): number | null {
  const siguiente = tiers.value.find((t) => t.tier === tier + 1)
  return siguiente ? siguiente.valor : null
}

function agregarTier() {
  const valor = valorNuevoTier.value
  if (valor == null || valor < 1) {
    notificar('error', 'Valor debe ser mayor a 0')
    return
  }
  const anterior = valorAnteriorDe(proximoTier.value)
  if (anterior != null && valor <= anterior) {
    notificar('error', `Valor debe ser mayor a ${anterior} (tier ${proximoTier.value - 1})`)
    return
  }
  return ejecutar(
    async () => {
      await tierApi.create({ tier: proximoTier.value, valor })
      valorNuevoTier.value = null
    },
    `Tier ${proximoTier.value} agregado`,
    'Error al agregar',
  )
}

function guardarTier(t: TierConfig) {
  const nuevo = editValores.value[t.tier]
  if (nuevo == null || nuevo === t.valor) return
  if (nuevo < 1) {
    notificar('error', 'Valor debe ser mayor a 0')
    return
  }
  const anterior = valorAnteriorDe(t.tier)
  if (anterior != null && nuevo <= anterior) {
    notificar('error', `Valor debe ser mayor a ${anterior} (tier ${t.tier - 1})`)
    return
  }
  const siguiente = valorSiguienteDe(t.tier)
  if (siguiente != null && nuevo >= siguiente) {
    notificar('error', `Valor debe ser menor a ${siguiente} (tier ${t.tier + 1})`)
    return
  }
  return ejecutar(
    () => tierApi.update(t.tier, nuevo).then(() => undefined),
    `Tier ${t.tier} actualizado`,
    'Error al actualizar',
  )
}

const eliminacion = useConfirmar<TierConfig>()
const recalculo = useConfirmar()

async function ejecutarEliminar(t: TierConfig) {
  try {
    await tierApi.remove(t.tier)
    notificar('ok', `Tier ${t.tier} eliminado`)
    await Promise.all([refresh(), refrescarCache(true)])
  } catch (e: any) {
    fallar(e, 'Error al eliminar')
    throw e
  }
}

function guardarConfig() {
  if (editRecargoBase.value == null || editRecargoPorTier.value == null) return
  return ejecutar(
    () => intercambioConfigApi.update({
      recargo_base: editRecargoBase.value!,
      recargo_por_tier: editRecargoPorTier.value!,
    }).then(() => undefined),
    'Config de intercambio actualizada',
    'Error al guardar',
  )
}

async function ejecutarRecalculo() {
  try {
    const { actualizados } = await recalcularTiers()
    notificar('ok', `Recálculo listo. Juegos actualizados: ${actualizados}`)
  } catch (e: any) {
    fallar(e, 'Error al recalcular')
    throw e
  }
}
</script>

<template>
  <div class="space-y-10">
    <div>
      <h1 class="text-3xl font-black tracking-tight mb-1">Tiers</h1>
      <p class="text-muted text-sm">Umbrales de precio y recargos de intercambio.</p>
    </div>

    <section>
      <h2 class="text-xl font-bold mb-4">Umbrales de tier</h2>

      <div v-if="pending" class="text-muted text-sm">Cargando...</div>

      <div v-else class="space-y-2 mb-4">
        <div
          v-for="t in tiers"
          :key="t.tier"
          class="flex items-center gap-3 p-3 bg-bg-card border border-border rounded"
        >
          <div class="font-mono text-sm w-16">Tier {{ t.tier }}</div>
          <PanelInput
            v-model.number="editValores[t.tier]"
            type="number"
            min="1"
            class="w-40"
          />
          <button :class="btnAcento" @click="guardarTier(t)">Guardar</button>
          <button :class="btnDanger" @click="eliminacion.abrir(t)">Eliminar</button>
        </div>
      </div>

      <div class="flex items-end gap-3 p-3 bg-bg-soft border border-border rounded">
        <div>
          <label class="block text-xs text-muted mb-1">Valor del nuevo tier</label>
          <PanelInput
            v-model.number="valorNuevoTier"
            type="number"
            min="1"
            placeholder="50000"
            class="w-40"
          />
        </div>
        <button :class="btnAcentoLg" @click="agregarTier">
          + Agregar tier
        </button>
      </div>
    </section>

    <section>
      <h2 class="text-xl font-bold mb-4">Recargo de intercambio</h2>
      <p class="text-muted text-sm mb-4">
        Aplica cuando al cliente le faltan más tiers de los que existen. Fórmula:
        <code>valor_tier_max + recargo_base + (excedente - 1) × recargo_por_tier</code>.
      </p>

      <div class="flex flex-wrap items-end gap-3 p-3 bg-bg-card border border-border rounded">
        <div>
          <label class="block text-xs text-muted mb-1">Recargo base</label>
          <PanelInput v-model.number="editRecargoBase" type="number" min="0" class="w-40" />
        </div>
        <div>
          <label class="block text-xs text-muted mb-1">Recargo por tier</label>
          <PanelInput v-model.number="editRecargoPorTier" type="number" min="0" class="w-40" />
        </div>
        <button :class="btnAcentoLg" @click="guardarConfig">Guardar</button>
      </div>
    </section>

    <section>
      <h2 class="text-xl font-bold mb-4">Recálculo masivo</h2>
      <p class="text-muted text-sm mb-4">
        Recorre todos los juegos activos y reasigna su tier según los umbrales actuales.
        Los intercambios ya registrados mantienen su tier original.
      </p>
      <button :class="btnWarning" @click="recalculo.abrir()">
        Recalcular tiers de juegos activos
      </button>
    </section>

    <ModalConfirmar
      v-if="eliminacion.payload"
      :titulo="`Eliminar tier ${eliminacion.payload.tier}`"
      :mensaje="`Se eliminará el tier ${eliminacion.payload.tier} y los tiers superiores se renumerarán para mantener la continuidad. Los juegos que estaban en tiers superiores bajarán en 1. Los intercambios ya registrados no cambian.`"
      label-confirmar="Eliminar"
      variante="danger"
      :loading="eliminacion.loading"
      @close="eliminacion.cerrar()"
      @confirmar="eliminacion.confirmar(ejecutarEliminar)"
    />

    <ModalConfirmar
      v-if="recalculo.payload"
      titulo="Recalcular tiers"
      mensaje="Se recorrerán todos los juegos activos y se reasignará su tier según los umbrales actuales. Los intercambios ya registrados mantienen su tier original."
      label-confirmar="Recalcular"
      variante="warning"
      :loading="recalculo.loading"
      @close="recalculo.cerrar()"
      @confirmar="recalculo.confirmar(ejecutarRecalculo)"
    />
  </div>
</template>
