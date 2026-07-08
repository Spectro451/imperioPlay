<script setup lang="ts">
const props = defineProps<{
  precio_base: number
  precio_final: number
  descuento_porcentaje?: number
  descuento_fijo?: number
}>()

const tieneOferta = computed(
  () => (props.descuento_porcentaje ?? 0) > 0 || (props.descuento_fijo ?? 0) > 0,
)
</script>

<template>
  <div>
    <p v-if="tieneOferta" class="text-sm text-muted line-through">
      ${{ precio_base.toLocaleString('es-AR') }}
    </p>
    <p class="text-3xl font-black text-acento-1">${{ precio_final.toLocaleString('es-AR') }}</p>
    <span
      v-if="tieneOferta"
      class="inline-block mt-1 text-xs font-bold bg-bg-card border border-border px-2 py-0.5 rounded"
    >
      {{ descuento_porcentaje ? `${descuento_porcentaje}% OFF` : `$${descuento_fijo} OFF` }}
    </span>
  </div>
</template>
