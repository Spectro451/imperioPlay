<script setup lang="ts">
const { getAll, getOfertas } = useProductoApi()

const [{ data: ultimosData }, { data: ofertasData }] = await Promise.all([
  useAsyncData('home-ultimos', () => getAll({ orden: 'id-desc' })),
  useAsyncData('home-ofertas', () => getOfertas()),
])

const ultimosAgregados = ultimosData.value?.items ?? []
const ofertas = ofertasData.value?.items ?? []
</script>

<template>
  <div>
    <div class="bg-bg-hard border-b border-border">
      <div class="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <p class="text-acento-1 text-xs font-bold uppercase tracking-widest mb-4">
          Tu tienda de videojuegos física
        </p>
        <h1 class="text-5xl md:text-7xl font-black tracking-tight leading-none text-fg">
          Imperio<span class="text-acento-1">Play</span>
        </h1>
        <p class="text-muted mt-5 text-base md:text-lg max-w-md leading-relaxed">
          Juegos y consolas nuevos y usados. Retirá en local o hacé un intercambio.
        </p>
        <NuxtLink
          to="/catalogo"
          class="inline-block mt-8 px-6 py-3 border border-acento-1 text-acento-1 font-bold rounded-lg hover:bg-acento-1 hover:text-bg-hard transition-colors text-sm"
        >
          Ver catálogo completo
        </NuxtLink>
      </div>
    </div>

    <CarruselProductos titulo="Últimos agregados" :items="ultimosAgregados.slice(0, 10)" ver-todos-link="/catalogo" />
    <div class="border-t border-border" />
    <CarruselProductos titulo="Últimas ofertas" :items="ofertas.slice(0, 10)" ver-todos-link="/ofertas" />
    <div class="border-t border-border" />

    <section class="py-10">
      <div class="max-w-7xl mx-auto px-4 md:px-8">
        <h2 class="text-2xl font-black tracking-tight mb-5 text-muted">Por definir</h2>
        <div class="h-44 bg-bg-card rounded-lg flex items-center justify-center text-muted text-sm">
          Sección pendiente
        </div>
      </div>
    </section>
  </div>
</template>
