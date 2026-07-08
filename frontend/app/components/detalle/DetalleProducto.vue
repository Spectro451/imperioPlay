<script setup lang="ts">
type Tipo = 'juego' | 'consola'

const props = defineProps<{
  item: any
  tipo: Tipo
}>()

const plataforma = computed(() =>
  props.tipo === 'juego' ? props.item.consola : props.item.generacion,
)
const backLink = computed(() =>
  props.tipo === 'juego' ? '/catalogo/juegos' : '/catalogo/consolas',
)
const backLabel = computed(() =>
  props.tipo === 'juego' ? 'Volver a juegos' : 'Volver a consolas',
)
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 md:px-8 py-10">
    <NuxtLink
      :to="backLink"
      class="text-sm text-muted hover:text-acento-1 transition-colors mb-8 inline-block"
    >
      ← {{ backLabel }}
    </NuxtLink>

    <div class="grid md:grid-cols-2 gap-8 mt-4">
      <GaleriaFotos :fotos="item.fotos" :alt="item.producto.nombre" />

      <div class="flex flex-col gap-4">
        <DetalleHeader
          :plataforma="plataforma"
          :estado="item.estado"
          :nombre="item.producto.nombre"
          :tier="tipo === 'juego' ? item.tier : undefined"
        />
        <PrecioDisplay
          :precio_base="item.precio_base"
          :precio_final="item.precio_final"
          :descuento_porcentaje="item.descuento_porcentaje"
          :descuento_fijo="item.descuento_fijo"
        />
        <StockBadge :stock="item.stock" />

        <p v-if="item.producto.sku" class="text-sm text-muted mt-2">SKU: {{ item.producto.sku }}</p>
      </div>
    </div>
  </div>
</template>
