<script setup lang="ts">
const props = defineProps<{
  tipo: 'juego' | 'consola'
  variantId: number
  size?: 'sm' | 'lg'
}>()

const { user } = useAuth()
const { tieneVariante, toggle } = useWishlist()
const { notificar } = useNotify()

const size = computed(() => props.size ?? 'sm')
const esCliente = computed(() => user.value?.rol === 'cliente')
const activo = computed(() => tieneVariante(props.tipo, props.variantId))
const loading = ref(false)

async function onClick(e: MouseEvent) {
  e.preventDefault()
  e.stopPropagation()
  if (!user.value) {
    notificar('error', 'Inicia sesión para guardar en tu wishlist')
    await navigateTo('/login')
    return
  }
  if (!esCliente.value) {
    notificar('error', 'La wishlist es solo para clientes')
    return
  }
  loading.value = true
  try {
    const nuevo = await toggle(props.tipo, props.variantId)
    notificar('ok', nuevo ? 'Agregado a tu wishlist' : 'Quitado de tu wishlist')
  } catch {
    notificar('error', 'No se pudo actualizar la wishlist')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <button
    v-if="esCliente"
    type="button"
    :disabled="loading"
    :aria-label="activo ? 'Quitar de wishlist' : 'Agregar a wishlist'"
    :title="activo ? 'Quitar de wishlist' : 'Agregar a wishlist'"
    :class="[
      'flex items-center justify-center rounded-full transition-all backdrop-blur-sm',
      size === 'lg'
        ? 'w-11 h-11'
        : 'w-8 h-8',
      activo
        ? 'bg-danger/90 text-white hover:bg-danger'
        : 'bg-bg-hard/70 text-white hover:bg-bg-hard/90',
      loading && 'opacity-60 cursor-wait',
    ]"
    @click="onClick"
  >
    <svg
      :class="size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'"
      :fill="activo ? 'currentColor' : 'none'"
      stroke="currentColor"
      stroke-width="2"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
      />
    </svg>
  </button>
</template>
