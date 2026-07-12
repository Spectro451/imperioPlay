<script setup lang="ts">
const { filtros, page, items, totalPages, pending } = await useCatalogo('juego')
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 md:px-8 py-10">
    <div class="mb-6">
      <h1 class="text-3xl font-black tracking-tight mb-4">Juegos</h1>
      <FiltrosCatalogo :filtros="filtros" tipo="juego" />
    </div>
    <GridProductos :items="items" :page="page" :total-pages="totalPages" :loading="pending" @update:page="page = $event" />
  </div>
</template>
