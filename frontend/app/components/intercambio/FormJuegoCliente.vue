<script setup lang="ts">
import type { JuegoClienteInput } from '~/composables/useIntercambioEnCurso'
import type { Plataforma, EstadoJuego } from '~/composables/api/useIntercambioApi'

const props = defineProps<{
  juego: JuegoClienteInput
}>()

const emit = defineEmits<{
  close: []
  guardar: [datos: JuegoClienteInput]
}>()

const { buscarPorSku, getNombres } = useProductoApi()
const { uploadFile, hashFile } = useCloudinary()
const { tierDe } = useTierConfigCache()

const plataformas: Plataforma[] = ['Xbox360', 'XboxOne', 'XboxSeries', 'Ps3', 'Ps4', 'Ps5', 'Switch', 'Switch2']

const sku = ref(props.juego.sku)
const nombre = ref(props.juego.nombre)
const consola = ref<Plataforma | ''>(props.juego.consola)
const estado = ref<EstadoJuego>(props.juego.estado)
const precio_base = ref(props.juego.precio_base)
const cantidad = ref(props.juego.cantidad)

type FotoItem = { url: string; file?: File; hash?: string }
const fotos = ref<FotoItem[]>(props.juego.fotos.map(url => ({ url })))

const productoBloqueado = ref(false)
const skuBuscando = ref(false)
const productoEncontrado = ref<any>(null)
const lastSku = ref('')

const subiendoFotos = ref(0)
const loading = ref(false)
const error = ref('')

const sugerencias = ref<string[]>([])
const mostrarSugerencias = ref(false)
let debounceTimer: any = null

async function onSkuBlur() {
  const val = sku.value.trim()
  if (val === lastSku.value) return
  lastSku.value = val
  if (!val) {
    productoBloqueado.value = false
    productoEncontrado.value = null
    return
  }
  skuBuscando.value = true
  productoEncontrado.value = null
  try {
    const res = await buscarPorSku(val)
    if (res.encontrado && res.producto) {
      if (res.producto.tipo !== 'juego') {
        error.value = `SKU pertenece a un producto tipo "${res.producto.tipo}", no juego.`
        productoBloqueado.value = false
        return
      }
      nombre.value = res.producto.nombre
      const primeraVariante = res.producto.juegos?.[0]
      if (primeraVariante) {
        consola.value = primeraVariante.consola ?? consola.value
      }
      productoBloqueado.value = true
      productoEncontrado.value = res.producto
    } else {
      productoBloqueado.value = false
    }
  } catch {
    productoEncontrado.value = null
  } finally {
    skuBuscando.value = false
  }
}

function onNombreInput() {
  clearTimeout(debounceTimer)
  if (productoBloqueado.value) return
  if (!nombre.value.trim()) {
    sugerencias.value = []
    mostrarSugerencias.value = false
    return
  }
  debounceTimer = setTimeout(async () => {
    try {
      sugerencias.value = await getNombres(nombre.value.trim())
      mostrarSugerencias.value = sugerencias.value.length > 0
    } catch {
      sugerencias.value = []
    }
  }, 300)
}

function aplicarProducto(prod: any, plataforma?: string) {
  nombre.value = prod.nombre
  sku.value = prod.sku ?? sku.value
  lastSku.value = sku.value.trim()
  productoEncontrado.value = prod
  productoBloqueado.value = true
  const variante = plataforma
    ? prod.juegos?.find((j: any) => j.consola === plataforma) ?? prod.juegos?.[0]
    : prod.juegos?.[0]
  if (variante) consola.value = variante.consola ?? consola.value
}

const { variantesModal, buscarPorNombre, onVarianteElegida } = useElegirProducto({
  filtroTipo: 'juego',
  onSeleccionar: aplicarProducto,
})

async function elegirSugerencia(n: string) {
  nombre.value = n
  mostrarSugerencias.value = false
  await buscarPorNombre(n)
}

function cerrarSugerenciasDelayed() {
  setTimeout(() => { mostrarSugerencias.value = false }, 150)
}

const variantesReferencia = computed(() => {
  const prod = productoEncontrado.value
  if (!prod || !prod.juegos?.length) return []
  return prod.juegos.map((j: any) => ({
    consola: j.consola,
    estado: j.estado,
    precio: j.precio_final,
    tier: j.tier ?? tierDe(j.precio_final),
  }))
})

const varianteMerge = computed<any | null>(() => {
  const prod = productoEncontrado.value
  if (!prod || !prod.juegos?.length) return null
  return prod.juegos.find((j: any) => j.consola === consola.value && j.estado === estado.value) ?? null
})

watch(varianteMerge, (v) => {
  if (v) precio_base.value = v.precio_base
})

const skuMensaje = computed(() => {
  const prod = productoEncontrado.value
  if (!prod) {
    if (lastSku.value) return 'SKU nuevo: se creará el juego en catálogo.'
    return ''
  }
  if (!prod.isActive) return 'SKU pertenece a un producto desactivado. Se reactivará al guardar.'
  return 'Producto existente en catálogo: se sumará stock si la variante coincide.'
})

async function onFilesSelected(e: Event) {
  const input = e.target as HTMLInputElement
  const files = input.files
  if (!files || !files.length) return
  for (const file of Array.from(files)) {
    const hash = await hashFile(file)
    const duplicado = fotos.value.some(f =>
      (f.hash && f.hash === hash) || f.url.includes(hash),
    )
    if (duplicado) continue
    const blobUrl = URL.createObjectURL(file)
    fotos.value.push({ url: blobUrl, file, hash })
  }
  input.value = ''
}

function removerFoto(i: number) {
  const item = fotos.value[i]
  if (item?.file && item.url.startsWith('blob:')) URL.revokeObjectURL(item.url)
  fotos.value.splice(i, 1)
}

onMounted(() => {
  if (sku.value.trim()) onSkuBlur()
})

onBeforeUnmount(() => {
  for (const item of fotos.value) {
    if (item.file && item.url.startsWith('blob:')) URL.revokeObjectURL(item.url)
  }
})

const tierPreview = computed(() => {
  if (varianteMerge.value) return varianteMerge.value.tier ?? tierDe(varianteMerge.value.precio_final)
  return tierDe(Number(precio_base.value) || 0)
})

const puedeGuardar = computed(() =>
  sku.value.trim().length > 0
  && nombre.value.trim().length > 0
  && consola.value !== ''
  && (Number(precio_base.value) || 0) > 0
  && (Number(cantidad.value) || 0) > 0,
)

async function submit() {
  if (!puedeGuardar.value) {
    error.value = 'Completá todos los campos requeridos.'
    return
  }
  error.value = ''
  loading.value = true
  try {
    const fotosFinales: string[] = []
    for (const item of fotos.value) {
      if (item.file) {
        subiendoFotos.value++
        try {
          const url = await uploadFile(item.file)
          if (!fotosFinales.includes(url)) fotosFinales.push(url)
        } finally {
          subiendoFotos.value--
        }
      } else if (!fotosFinales.includes(item.url)) {
        fotosFinales.push(item.url)
      }
    }
    emit('guardar', {
      key: props.juego.key,
      sku: sku.value.trim(),
      nombre: nombre.value.trim(),
      consola: consola.value as Plataforma,
      estado: estado.value,
      precio_base: Number(precio_base.value) || 0,
      cantidad: Number(cantidad.value) || 1,
      fotos: fotosFinales,
      tierMerge: varianteMerge.value?.tier ?? null,
    })
  } catch (e: any) {
    error.value = e?.data?.message ?? 'Error al guardar'
  } finally {
    loading.value = false
  }
}

const inputClass = 'bg-bg-hard border border-border text-sm text-fg rounded px-3 py-2 focus:outline-none focus:border-acento-1 transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed'
const labelClass = 'text-xs font-semibold uppercase tracking-widest text-muted mb-1'
</script>

<template>
  <div class="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" @click.self="emit('close')">
    <div class="bg-bg-card border border-border rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <div class="px-6 py-4 border-b border-border flex items-center justify-between">
        <h2 class="text-lg font-black tracking-tight">Juego que trae el cliente</h2>
        <button class="text-muted hover:text-fg text-xl leading-none" @click="emit('close')">×</button>
      </div>

      <form class="px-6 py-4 flex flex-col gap-3" @submit.prevent="submit">
        <div class="flex flex-col gap-1">
          <label :class="labelClass">SKU (código de barras)</label>
          <input
            v-model="sku"
            required
            :class="inputClass"
            placeholder="Pistoletear o escribir…"
            @blur="onSkuBlur"
            @keydown.enter.prevent="onSkuBlur"
          />
          <p v-if="skuBuscando" class="text-xs text-muted">Buscando…</p>
          <p v-else-if="skuMensaje" class="text-xs text-muted">{{ skuMensaje }}</p>
        </div>

        <div class="flex flex-col gap-1 relative">
          <label :class="labelClass">Nombre</label>
          <input
            v-model="nombre"
            required
            :disabled="productoBloqueado"
            :class="inputClass"
            placeholder="GTA V"
            autocomplete="off"
            @input="onNombreInput"
            @focus="mostrarSugerencias = sugerencias.length > 0"
            @blur="cerrarSugerenciasDelayed"
          />
          <div
            v-if="mostrarSugerencias && sugerencias.length"
            class="absolute top-full left-0 right-0 bg-bg-hard border border-border border-t-0 rounded-b max-h-48 overflow-y-auto z-10"
          >
            <button
              v-for="n in sugerencias"
              :key="n"
              type="button"
              class="w-full text-left px-3 py-2 text-sm hover:bg-bg-card text-fg transition-colors"
              @mousedown.prevent="elegirSugerencia(n)"
            >
              {{ n }}
            </button>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="flex flex-col gap-1">
            <label :class="labelClass">Plataforma</label>
            <select v-model="consola" :disabled="productoBloqueado" :class="inputClass" required>
              <option value="" disabled>Elegir…</option>
              <option v-for="p in plataformas" :key="p" :value="p">{{ p }}</option>
            </select>
          </div>
          <div class="flex flex-col gap-1">
            <label :class="labelClass">Estado</label>
            <select v-model="estado" :class="inputClass">
              <option value="nuevo">Nuevo</option>
              <option value="usado">Usado</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="flex flex-col gap-1">
            <label :class="labelClass">Precio base</label>
            <input
              v-model.number="precio_base"
              type="number"
              min="1"
              required
              :disabled="!!varianteMerge"
              :class="inputClass"
            />
            <p class="text-[10px] text-muted">&nbsp;</p>
          </div>
          <div class="flex flex-col gap-1">
            <label :class="labelClass">Cantidad</label>
            <input v-model.number="cantidad" type="number" min="1" required :class="inputClass" />
          </div>
        </div>

        <div
          v-if="variantesReferencia.length"
          class="bg-bg-hard border border-border rounded px-3 py-2 text-xs text-muted flex flex-col gap-1"
        >
          <p :class="labelClass" class="!mb-0">Variantes en catálogo</p>
          <ul class="flex flex-col gap-0.5">
            <li v-for="(v, i) in variantesReferencia" :key="i" class="capitalize">
              {{ v.consola }} · {{ v.estado }} — ${{ v.precio.toLocaleString('es-AR') }} · tier {{ v.tier }}
            </li>
          </ul>
        </div>

        <div class="flex items-center justify-between bg-bg-hard border border-border rounded px-3 py-2">
          <span :class="labelClass" class="!mb-0">Tier estimado</span>
          <span class="text-lg font-bold text-acento-1">{{ tierPreview }}</span>
        </div>

        <div class="flex flex-col gap-2">
          <label :class="labelClass">Fotos</label>
          <div v-if="fotos.length" class="grid grid-cols-4 gap-2">
            <div
              v-for="(foto, i) in fotos"
              :key="foto.url"
              class="relative aspect-square bg-bg-hard border border-border rounded overflow-hidden group"
            >
              <img :src="foto.url" alt="" class="w-full h-full object-cover" />
              <span v-if="foto.file" class="absolute bottom-1 left-1 text-[10px] bg-black/70 text-acento-1 px-1.5 py-0.5 rounded">
                Pendiente
              </span>
              <button
                type="button"
                class="absolute top-1 right-1 w-6 h-6 bg-black/70 text-white text-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-danger"
                @click="removerFoto(i)"
              >
                ×
              </button>
            </div>
          </div>
          <label class="border border-dashed border-border rounded px-3 py-4 text-center text-sm text-muted hover:border-acento-1 hover:text-acento-1 transition-colors cursor-pointer">
            + Agregar fotos
            <input type="file" accept="image/*" multiple class="hidden" @change="onFilesSelected" />
          </label>
        </div>

        <p v-if="error" class="text-sm text-danger">{{ error }}</p>

        <div class="flex gap-3 pt-2">
          <button
            type="button"
            :disabled="loading"
            class="flex-1 px-4 py-2 text-sm text-muted hover:text-fg border border-border rounded transition-colors"
            @click="emit('close')"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="loading || !puedeGuardar || subiendoFotos > 0"
            class="flex-1 px-4 py-2 text-sm font-bold text-acento-1 border border-acento-1 hover:bg-acento-1 hover:text-bg-hard rounded transition-colors disabled:opacity-50"
          >
            {{ loading ? 'Guardando…' : subiendoFotos > 0 ? 'Subiendo fotos…' : 'Guardar' }}
          </button>
        </div>
      </form>
    </div>

    <ModalVariantes
      v-if="variantesModal"
      :variantes="variantesModal"
      @seleccionar="onVarianteElegida"
      @cerrar="variantesModal = null"
    />
  </div>
</template>
