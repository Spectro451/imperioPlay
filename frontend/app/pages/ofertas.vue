<script setup lang="ts">
const { filtros, page, items, totalPages } = await useCatalogo(undefined, true)
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 md:px-8 py-10">
    <div class="mb-6">
      <p class="text-acento-1 text-xs font-bold uppercase tracking-widest mb-1">Descuentos</p>
      <h1 class="text-3xl font-black tracking-tight mb-4">Últimas ofertas</h1>
      <FiltrosCatalogo :filtros="filtros" tipo="todos" />
    </div>
    <GridProductos :items="items" :page="page" :total-pages="totalPages" @update:page="page = $event" />
  </div>
</template>
