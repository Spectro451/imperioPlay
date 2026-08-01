<script setup lang="ts">
import type { ItemFlat } from '~/composables/useProductoTypes'
import type { WishlistItem } from '~/composables/api/useWishlistApi'

definePageMeta({ middleware: 'cliente' })

const { getAll } = useWishlistApi()
const { cargar: cargarIds } = useWishlist()

const { data, pending, refresh } = await useAsyncData('wishlist-mine', () => getAll())

await cargarIds(true)

function flat(w: WishlistItem): ItemFlat | null {
  const v: any = w.juego ?? w.consola
  if (!v || !v.producto) return null
  const tipo: 'juego' | 'consola' = w.juego ? 'juego' : 'consola'
  return {
    id: v.id,
    nombre: v.producto.nombre,
    sku: v.producto.sku,
    tipo,
    plataforma: tipo === 'juego' ? v.consola : v.generacion,
    estado: v.estado,
    precio_final: v.precio_final,
    precio_base: v.precio_base,
    descuento_porcentaje: v.descuento_porcentaje,
    descuento_fijo: v.descuento_fijo,
    fotos: v.fotos,
    stock: v.stock,
    isActive: v.isActive,
    tier: v.tier ?? 0,
  }
}

const items = computed<ItemFlat[]>(() =>
  (data.value ?? []).map(flat).filter((x): x is ItemFlat => x !== null),
)

watch(() => useWishlist().ids.value, () => refresh(), { deep: true })
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 md:px-8 py-12">
    <div class="flex items-baseline justify-between mb-8">
      <div>
        <h1 class="text-3xl font-black tracking-tight mb-1">Mi wishlist</h1>
        <p class="text-muted text-sm">Los productos que guardaste para más tarde.</p>
      </div>
      <NuxtLink to="/cuenta" class="text-sm text-muted hover:text-acento-1 transition-colors">
        ← Mi cuenta
      </NuxtLink>
    </div>

    <div v-if="pending" class="text-muted text-sm">Cargando...</div>
    <div v-else-if="items.length === 0" class="bg-bg-card border border-border rounded-lg p-12 text-center">
      <p class="text-muted mb-4">Todavía no guardaste nada.</p>
      <NuxtLink
        to="/catalogo"
        class="inline-block text-sm text-acento-1 px-4 py-2 border border-acento-1 rounded hover:bg-acento-1 hover:text-bg-hard transition-colors"
      >
        Ver catálogo
      </NuxtLink>
    </div>
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <TarjetaProducto v-for="item in items" :key="`${item.tipo}-${item.id}`" :item="item" fluid />
    </div>
  </div>
</template>
