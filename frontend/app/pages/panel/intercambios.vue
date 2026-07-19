<script setup lang="ts">
import type { ItemFlat } from '~/composables/useProductoTypes'
import type { JuegoClienteInput } from '~/composables/useIntercambioEnCurso'
import { crearJuegoClienteVacio } from '~/composables/useIntercambioEnCurso'

definePageMeta({ middleware: 'panel', layout: 'panel' })

const {
  lineasSolicitadas,
  juegosCliente,
  vendedor,
  metodoPago,
  montoPagado,
  totalTierSolicitado,
  totalTierCliente,
  faltante,
  dineroExtra,
  vuelto,
  puedeConfirmar,
  payload,
  cargarConfig,
  agregarSolicitado,
  quitarSolicitado,
  cambiarCantidadSolicitado,
  quitarJuegoCliente,
  cambiarCantidadCliente,
  limpiar,
} = useIntercambioEnCurso()

await cargarConfig()

const { create } = useIntercambioApi()
const { notificar } = useNotify()

const variantesModal = ref<ItemFlat[] | null>(null)
const juegoEditando = ref<JuegoClienteInput | null>(null)
const procesando = ref(false)

function agregar(variante: ItemFlat) {
  const res = agregarSolicitado(variante)
  if (!res.ok) notificar('error', res.motivo ?? 'No se pudo agregar')
}

function onMultiplesVariantes(variantes: ItemFlat[]) {
  variantesModal.value = variantes
}

function onSeleccionarModal(variante: ItemFlat) {
  agregar(variante)
  variantesModal.value = null
}

function abrirNuevoJuegoCliente() {
  juegoEditando.value = crearJuegoClienteVacio()
}

function abrirEditarJuegoCliente(key: string) {
  const j = juegosCliente.value.find(x => x.key === key)
  if (j) juegoEditando.value = { ...j }
}

function guardarJuegoCliente(datos: JuegoClienteInput) {
  const idx = juegosCliente.value.findIndex(j => j.key === datos.key)
  if (idx >= 0) {
    juegosCliente.value[idx] = datos
  } else {
    juegosCliente.value.push(datos)
  }
  juegoEditando.value = null
}

async function confirmar() {
  procesando.value = true
  try {
    await create(payload.value)
    notificar('ok', 'Intercambio registrado')
    limpiar()
  } catch (e: any) {
    const msg = e?.data?.message ?? e?.data?.mensaje ?? 'Error al registrar el intercambio'
    notificar('error', typeof msg === 'string' ? msg : 'Error al registrar el intercambio')
  } finally {
    procesando.value = false
  }
}

const cancelacion = useConfirmar()

function cancelar() {
  if (!lineasSolicitadas.value.length && !juegosCliente.value.length) return
  cancelacion.abrir()
}
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-black tracking-tight mb-1">Registrar intercambio</h1>
      <p class="text-muted text-sm">Cargá los juegos del inventario que se lleva el cliente y los que trae para canjear.</p>
    </div>

    <div class="mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">
      <div class="md:col-span-1">
        <SelectorVendedor
          v-model:vendedor="vendedor"
          @error="(m) => notificar('error', m)"
        />
      </div>
      <div class="md:col-span-2">
        <BuscadorVenta
          :tipos-habilitados="['juego']"
          @seleccionar="agregar"
          @multiples="onMultiplesVariantes"
          @error="(m) => notificar('error', m)"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 flex flex-col gap-6">
        <LineasSolicitadas
          :lineas="lineasSolicitadas"
          @cambiar-cantidad="cambiarCantidadSolicitado"
          @quitar="quitarSolicitado"
        />
        <LineasCliente
          :juegos="juegosCliente"
          @agregar="abrirNuevoJuegoCliente"
          @editar="abrirEditarJuegoCliente"
          @quitar="quitarJuegoCliente"
          @cambiar-cantidad="cambiarCantidadCliente"
        />
      </div>

      <div class="lg:col-span-1">
        <ResumenTiers
          :total-tier-solicitado="totalTierSolicitado"
          :total-tier-cliente="totalTierCliente"
          :faltante-tier="faltante.faltanteTier"
          :dinero-extra="dineroExtra"
          :cumple="faltante.cumple"
          :vuelto="vuelto"
          :puede-confirmar="puedeConfirmar"
          :procesando="procesando"
          v-model:metodo-pago="metodoPago"
          v-model:monto-pagado="montoPagado"
          @confirmar="confirmar"
          @cancelar="cancelar"
        />
      </div>
    </div>

    <ModalVariantes
      v-if="variantesModal"
      :variantes="variantesModal"
      @seleccionar="onSeleccionarModal"
      @cerrar="variantesModal = null"
    />

    <FormJuegoCliente
      v-if="juegoEditando"
      :juego="juegoEditando"
      @guardar="guardarJuegoCliente"
      @close="juegoEditando = null"
    />

    <ModalConfirmar
      v-if="cancelacion.payload"
      titulo="Cancelar intercambio"
      mensaje="Se descartarán los juegos solicitados y los que trae el cliente. Esta acción no se puede deshacer."
      label-confirmar="Cancelar intercambio"
      variante="warning"
      @close="cancelacion.cerrar()"
      @confirmar="cancelacion.confirmar(limpiar)"
    />
  </div>
</template>
