<script setup lang="ts">
const route = useRoute()
const { data: juego, error } = await useAsyncData(
  `juego-${route.params.id}`,
  () => useJuegoApi().getOne(Number(route.params.id)),
)

if (!error.value && !juego.value) throw createError({ statusCode: 404, message: 'Juego no encontrado' })
</script>

<template>
  <div v-if="error" class="max-w-4xl mx-auto px-4 md:px-8 py-20 text-muted text-sm text-center">
    No se pudo cargar el producto. El servidor no está disponible.
  </div>
  <DetalleProducto v-else-if="juego" :item="juego" tipo="juego" />
</template>
