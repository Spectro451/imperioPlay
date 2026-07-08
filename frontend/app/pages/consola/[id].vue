<script setup lang="ts">
const route = useRoute()
const { data: consola, error } = await useAsyncData(
  `consola-${route.params.id}`,
  () => useConsolaApi().getOne(Number(route.params.id)),
)

if (!error.value && !consola.value) throw createError({ statusCode: 404, message: 'Consola no encontrada' })
</script>

<template>
  <div v-if="error" class="max-w-4xl mx-auto px-4 md:px-8 py-20 text-muted text-sm text-center">
    No se pudo cargar el producto. El servidor no está disponible.
  </div>
  <DetalleProducto v-else-if="consola" :item="consola" tipo="consola" />
</template>
