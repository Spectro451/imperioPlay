<script setup lang="ts">
import type { ItemFlat } from '~/composables/useProductoTypes'

const props = defineProps<{
  item?: ItemFlat | null
}>()

const emit = defineEmits<{
  close: []
  saved: []
}>()

const { create: createJuego, update: updateJuego } = useJuegoApi()
const { create: createConsola, update: updateConsola } = useConsolaApi()
const { buscarPorSku, getNombres, buscarPorNombreExacto } = useProductoApi()

const isEdit = computed(() => !!props.item)

const plataformas = ['Xbox360', 'XboxOne', 'XboxSeries', 'Ps3', 'Ps4', 'Ps5', 'Switch', 'Switch2']

const tipo = ref<'juego' | 'consola'>(props.item?.tipo ?? 'juego')
const nombre = ref(props.item?.nombre ?? '')
const sku = ref('')
const plataforma = ref(props.item?.plataforma ?? 'Ps5')
const estado = ref(props.item?.estado ?? 'nuevo')
const stock = ref(props.item?.stock ?? 1)
const precio_base = ref(props.item?.precio_base ?? 0)
const descuento_porcentaje = ref(props.item?.descuento_porcentaje ?? 0)
const descuento_fijo = ref(props.item?.descuento_fijo ?? 0)

type FotoItem = { url: string; file?: File; hash?: string }

const fotos = ref<FotoItem[]>(
  (props.item?.fotos ?? []).map(url => ({ url })),
)
const initialFotoUrls = [...(props.item?.fotos ?? [])]
const subiendoFotos = ref(0)
const fotoError = ref('')
const { uploadFile, hashFile } = useCloudinary()

async function onFilesSelected(e: Event) {
  const input = e.target as HTMLInputElement
  const files = input.files
  if (!files || !files.length) return
  fotoError.value = ''
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

function removerFoto(index: number) {
  const item = fotos.value[index]
  if (item?.file && item.url.startsWith('blob:')) {
    URL.revokeObjectURL(item.url)
  }
  fotos.value.splice(index, 1)
}

function fotosCambiaron(): boolean {
  if (fotos.value.some(f => f.file)) return true
  const urls = fotos.value.map(f => f.url)
  if (urls.length !== initialFotoUrls.length) return true
  return urls.some((u, i) => u !== initialFotoUrls[i])
}

async function irAMerge(): Promise<boolean> {
  if (isEdit.value) return false
  const skuVal = sku.value.trim()
  if (!skuVal) return false
  try {
    const res = await buscarPorSku(skuVal)
    if (!res.encontrado || !res.producto) return false
    const variantes = tipo.value === 'juego'
      ? (res.producto.juegos ?? [])
      : (res.producto.consolas ?? [])
    return variantes.some((v: any) =>
      (v.consola ?? v.generacion) === plataforma.value && v.estado === estado.value,
    )
  } catch {
    return false
  }
}

onBeforeUnmount(() => {
  for (const item of fotos.value) {
    if (item.file && item.url.startsWith('blob:')) {
      URL.revokeObjectURL(item.url)
    }
  }
})

const loading = ref(false)
const error = ref('')

const productoBloqueado = ref(false)
const skuBuscando = ref(false)
const productoEncontrado = ref<any>(null)
const lastSku = ref('')

const skuMensaje = computed(() => {
  const prod = productoEncontrado.value
  if (!prod) {
    if (lastSku.value && !isEdit.value) return 'SKU nuevo: podés cargar el producto desde cero.'
    return ''
  }
  if (!prod.isActive) {
    return 'SKU pertenece a un producto desactivado. Al guardar se reactivará y se sumará el stock ingresado.'
  }
  const variantes = tipo.value === 'juego' ? (prod.juegos ?? []) : (prod.consolas ?? [])
  const variante = variantes.find((v: any) =>
    (v.consola ?? v.generacion) === plataforma.value && v.estado === estado.value,
  )
  if (variante && !variante.isActive) {
    return `Esta variante está desactivada (stock actual: ${variante.stock}). Al guardar se reactivará y se sumarán las unidades.`
  }
  return 'Producto existente: solo estado, precio y descuentos son editables.'
})

const skuAvisoReactivacion = computed(() => {
  const prod = productoEncontrado.value
  if (!prod) return false
  if (!prod.isActive) return true
  const variantes = tipo.value === 'juego' ? (prod.juegos ?? []) : (prod.consolas ?? [])
  const variante = variantes.find((v: any) =>
    (v.consola ?? v.generacion) === plataforma.value && v.estado === estado.value,
  )
  return !!variante && !variante.isActive
})

const sugerenciasNombre = ref<string[]>([])
const mostrarSugerencias = ref(false)
const buscandoSugerencias = ref(false)
let debounceNombreTimer: any = null

async function onSkuBlur() {
  const val = sku.value.trim()
  if (!val || isEdit.value) return
  if (val === lastSku.value) return
  lastSku.value = val
  skuBuscando.value = true
  productoEncontrado.value = null
  try {
    const res = await buscarPorSku(val)
    if (res.encontrado && res.producto) {
      nombre.value = res.producto.nombre
      tipo.value = res.producto.tipo
      const primeraVariante = tipo.value === 'juego'
        ? res.producto.juegos?.[0]
        : res.producto.consolas?.[0]
      if (primeraVariante) {
        plataforma.value = primeraVariante.consola ?? primeraVariante.generacion ?? plataforma.value
        estado.value = primeraVariante.estado ?? estado.value
        precio_base.value = primeraVariante.precio_base ?? 0
        descuento_porcentaje.value = primeraVariante.descuento_porcentaje ?? 0
        descuento_fijo.value = primeraVariante.descuento_fijo ?? 0
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
  clearTimeout(debounceNombreTimer)
  if (productoBloqueado.value || isEdit.value) return
  if (!nombre.value.trim()) {
    sugerenciasNombre.value = []
    mostrarSugerencias.value = false
    return
  }
  buscandoSugerencias.value = true
  debounceNombreTimer = setTimeout(async () => {
    try {
      sugerenciasNombre.value = await getNombres(nombre.value.trim())
      mostrarSugerencias.value = sugerenciasNombre.value.length > 0
    } finally {
      buscandoSugerencias.value = false
    }
  }, 300)
}

async function elegirSugerencia(n: string) {
  nombre.value = n
  mostrarSugerencias.value = false
  const prod = await buscarPorNombreExacto(n)
  if (!prod) return
  tipo.value = prod.tipo
  sku.value = prod.sku ?? sku.value
  lastSku.value = sku.value.trim()
  productoEncontrado.value = prod
  productoBloqueado.value = true
  const primeraVariante = prod.tipo === 'juego' ? prod.juegos?.[0] : prod.consolas?.[0]
  if (primeraVariante) {
    plataforma.value = primeraVariante.consola ?? primeraVariante.generacion ?? plataforma.value
    estado.value = primeraVariante.estado ?? estado.value
    precio_base.value = primeraVariante.precio_base ?? 0
    descuento_porcentaje.value = primeraVariante.descuento_porcentaje ?? 0
    descuento_fijo.value = primeraVariante.descuento_fijo ?? 0
  }
}

const descuentoError = computed(() => {
  const p = Number(descuento_porcentaje.value) || 0
  const f = Number(descuento_fijo.value) || 0
  const base = Number(precio_base.value) || 0
  if (p > 0 && f > 0) return 'Solo puede haber un tipo de descuento a la vez.'
  if (p > 100) return 'El descuento porcentual no puede superar el 100%.'
  if (f > base) return 'El descuento fijo no puede superar el precio base.'
  return ''
})

const precioFinal = computed(() => {
  const base = Number(precio_base.value) || 0
  const p = Number(descuento_porcentaje.value) || 0
  const f = Number(descuento_fijo.value) || 0
  if (descuentoError.value) return base
  if (p > 0) return Math.round(base * (1 - p / 100))
  if (f > 0) return base - f
  return base
})

const inputClass = 'bg-bg-hard border border-border text-sm text-fg rounded px-3 py-2 focus:outline-none focus:border-acento-1 transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed'
const labelClass = 'text-xs font-semibold uppercase tracking-widest text-muted mb-1'

const ALLOWED_KEYS = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End']
function soloNumeros(e: KeyboardEvent) {
  if (e.ctrlKey || e.metaKey) return
  if (ALLOWED_KEYS.includes(e.key)) return
  if (!/^\d$/.test(e.key)) e.preventDefault()
}
function bloquearPaste(e: ClipboardEvent) {
  const texto = e.clipboardData?.getData('text') ?? ''
  if (!/^\d+$/.test(texto)) e.preventDefault()
}

async function chequearColision(): Promise<boolean> {
  if (isEdit.value || productoBloqueado.value) return true
  const prod = await buscarPorNombreExacto(nombre.value.trim())
  if (!prod) return true
  if (prod.sku === sku.value.trim()) return true
  const variantes = prod.tipo === 'juego' ? (prod.juegos ?? []) : (prod.consolas ?? [])
  const colisiona = variantes.some((v: any) => {
    const platMatch = (v.consola ?? v.generacion) === plataforma.value
    return platMatch && v.estado === estado.value
  })
  if (!colisiona) return true
  return confirm(
    `Ya existe "${prod.nombre}" (${plataforma.value} · ${estado.value}) con SKU "${prod.sku}".\n\n` +
    `Estás por crear otro producto con el mismo nombre y variante pero SKU distinto ("${sku.value}").\n\n` +
    `¿Es una edición diferente (EU, LAS, etc.)?`
  )
}

async function submit() {
  if (descuentoError.value) {
    error.value = descuentoError.value
    return
  }
  if (!isEdit.value && Number(stock.value) < 1) {
    error.value = 'El stock mínimo para crear un producto es 1.'
    return
  }
  if (Number(precio_base.value) < 1) {
    error.value = 'El precio base debe ser mayor a 0.'
    return
  }
  error.value = ''

  const confirmado = await chequearColision()
  if (!confirmado) return

  loading.value = true
  try {
    const varianteData: any = {
      stock: Number(stock.value),
      precio_base: Number(precio_base.value),
      descuento_porcentaje: Number(descuento_porcentaje.value) || undefined,
      descuento_fijo: Number(descuento_fijo.value) || undefined,
    }

    const willMerge = await irAMerge()

    let fotosFinales: string[] = []
    const debeAdjuntarFotos = isEdit.value || !willMerge
    if (debeAdjuntarFotos) {
      for (const item of fotos.value) {
        if (item.file) {
          subiendoFotos.value++
          try {
            const uploadedUrl = await uploadFile(item.file)
            if (!fotosFinales.includes(uploadedUrl)) fotosFinales.push(uploadedUrl)
          } finally {
            subiendoFotos.value--
          }
        } else if (!fotosFinales.includes(item.url)) {
          fotosFinales.push(item.url)
        }
      }
    }

    if (isEdit.value && props.item) {
      if (fotosCambiaron()) varianteData.fotos = fotosFinales
      if (tipo.value === 'juego') {
        await updateJuego(props.item.id, { ...varianteData, consola: plataforma.value, estado: estado.value })
      } else {
        await updateConsola(props.item.id, { ...varianteData, generacion: plataforma.value, estado: estado.value })
      }
    } else {
      if (!willMerge) varianteData.fotos = fotosFinales
      const productoBase = { nombre: nombre.value, sku: sku.value }
      if (tipo.value === 'juego') {
        await createJuego({
          producto: { ...productoBase, tipo: 'juego' },
          juego: { ...varianteData, consola: plataforma.value, estado: estado.value },
        })
      } else {
        await createConsola({
          producto: { ...productoBase, tipo: 'consola' },
          consola: { ...varianteData, generacion: plataforma.value, estado: estado.value },
        })
      }
    }
    emit('saved')
  } catch (e: any) {
    const msg = e?.data?.message
    error.value = Array.isArray(msg) ? msg[0] : (msg ?? 'Error al guardar')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" @click.self="emit('close')">
    <div class="bg-bg-card border border-border rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <div class="px-6 py-4 border-b border-border flex items-center justify-between">
        <h2 class="text-lg font-black tracking-tight">
          {{ isEdit ? 'Editar producto' : 'Nuevo producto' }}
        </h2>
        <button class="text-muted hover:text-fg text-xl leading-none" @click="emit('close')">×</button>
      </div>

      <form class="px-6 py-4 flex flex-col gap-3" @submit.prevent="submit">
        <div v-if="!isEdit" class="flex flex-col gap-1">
          <label :class="labelClass">SKU (código de barras)</label>
          <input
            v-model="sku"
            required
            :class="inputClass"
            placeholder="Pistoletear o escribir..."
            @blur="onSkuBlur"
            @keydown.enter.prevent="onSkuBlur"
          />
          <p v-if="skuBuscando" class="text-xs text-muted">Buscando...</p>
          <p v-else-if="skuMensaje" class="text-xs" :class="skuAvisoReactivacion ? 'text-acento-1' : 'text-muted'">
            {{ skuMensaje }}
          </p>
        </div>

        <div v-if="!isEdit" class="flex flex-col gap-1">
          <label :class="labelClass">Tipo</label>
          <div class="flex gap-2">
            <button
              type="button"
              :disabled="productoBloqueado"
              :class="[
                'flex-1 py-2 text-sm font-bold rounded border transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
                tipo === 'juego' ? 'border-acento-1 text-acento-1' : 'border-border text-muted hover:text-fg'
              ]"
              @click="tipo = 'juego'"
            >
              Juego
            </button>
            <button
              type="button"
              :disabled="productoBloqueado"
              :class="[
                'flex-1 py-2 text-sm font-bold rounded border transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
                tipo === 'consola' ? 'border-acento-1 text-acento-1' : 'border-border text-muted hover:text-fg'
              ]"
              @click="tipo = 'consola'"
            >
              Consola
            </button>
          </div>
        </div>

        <div v-if="!isEdit" class="flex flex-col gap-1 relative">
          <label :class="labelClass">Nombre</label>
          <input
            v-model="nombre"
            required
            :disabled="productoBloqueado"
            :class="inputClass"
            placeholder="GTA V"
            autocomplete="off"
            @input="onNombreInput"
            @focus="mostrarSugerencias = sugerenciasNombre.length > 0"
            @blur="setTimeout(() => mostrarSugerencias = false, 150)"
          />
          <div
            v-if="mostrarSugerencias && sugerenciasNombre.length"
            class="absolute top-full left-0 right-0 bg-bg-hard border border-border border-t-0 rounded-b max-h-48 overflow-y-auto z-10"
          >
            <button
              v-for="n in sugerenciasNombre"
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
            <label :class="labelClass">{{ tipo === 'juego' ? 'Plataforma' : 'Generación' }}</label>
            <select v-model="plataforma" :disabled="productoBloqueado" :class="inputClass">
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
            <label :class="labelClass">Stock</label>
            <input v-model.number="stock" type="number" :min="isEdit ? 0 : 1" required :class="inputClass" @keydown="soloNumeros" @paste="bloquearPaste" />
          </div>
          <div class="flex flex-col gap-1">
            <label :class="labelClass">Precio base</label>
            <input v-model.number="precio_base" type="number" min="1" required :class="inputClass" @keydown="soloNumeros" @paste="bloquearPaste" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="flex flex-col gap-1">
            <label :class="labelClass">Descuento %</label>
            <input v-model.number="descuento_porcentaje" type="number" min="0" max="100" :class="inputClass" @keydown="soloNumeros" @paste="bloquearPaste" />
          </div>
          <div class="flex flex-col gap-1">
            <label :class="labelClass">Descuento fijo</label>
            <input v-model.number="descuento_fijo" type="number" min="0" :class="inputClass" @keydown="soloNumeros" @paste="bloquearPaste" />
          </div>
        </div>

        <p v-if="descuentoError" class="text-sm text-red-500">{{ descuentoError }}</p>

        <div class="flex items-center justify-between bg-bg-hard border border-border rounded px-3 py-2">
          <span :class="labelClass" class="!mb-0">Precio final</span>
          <span class="text-lg font-bold text-acento-1">
            ${{ formatearPrecio(precioFinal) }}
          </span>
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
              <span
                v-if="foto.file"
                class="absolute bottom-1 left-1 text-[10px] bg-black/70 text-acento-1 px-1.5 py-0.5 rounded"
              >
                Pendiente
              </span>
              <button
                type="button"
                class="absolute top-1 right-1 w-6 h-6 bg-black/70 text-white text-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                @click="removerFoto(i)"
              >
                ×
              </button>
            </div>
          </div>

          <label class="border border-dashed border-border rounded px-3 py-4 text-center text-sm text-muted hover:border-acento-1 hover:text-acento-1 transition-colors cursor-pointer">
            + Agregar fotos
            <input
              type="file"
              accept="image/*"
              multiple
              class="hidden"
              @change="onFilesSelected"
            />
          </label>

          <p v-if="fotoError" class="text-xs text-red-500">{{ fotoError }}</p>
        </div>

        <p v-if="error" class="text-sm text-red-500">{{ error }}</p>

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
            :disabled="loading || !!descuentoError || subiendoFotos > 0"
            class="flex-1 px-4 py-2 text-sm font-bold text-acento-1 border border-acento-1 hover:bg-acento-1 hover:text-bg-hard rounded transition-colors disabled:opacity-50"
          >
            {{ loading ? 'Guardando...' : subiendoFotos > 0 ? 'Subiendo fotos...' : 'Guardar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
