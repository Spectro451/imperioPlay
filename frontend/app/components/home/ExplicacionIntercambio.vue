<script setup lang="ts">
const pasos = [
  {
    numero: 1,
    titulo: 'Trae tus juegos',
    texto: 'Acércate al local con las copias que quieras entregar. Aceptamos juegos y consolas, nuevos o usados.',
  },
  {
    numero: 2,
    titulo: 'Tasamos por tier',
    texto: 'Cada juego cae en un tier según su valor. Sumamos los tiers de lo que traes y los comparamos con lo que quieres llevar.',
  },
  {
    numero: 3,
    titulo: 'Lleva otros o paga la diferencia',
    texto: 'Si te alcanza, eliges del catálogo y te vas con juegos nuevos. Si falta, pagas solo la diferencia según el tier.',
  },
]
</script>

<template>
  <section class="py-16 md:py-20 bg-bg-hard">
    <div class="max-w-7xl mx-auto px-4 md:px-8">
      <p class="text-acento-1 text-xs font-bold uppercase tracking-widest mb-3">
        Trae, tasa, lleva
      </p>
      <h2 class="text-3xl md:text-4xl font-black tracking-tight mb-3">
        ¿Cómo funcionan los intercambios?
      </h2>
      <p class="text-muted text-base max-w-xl mb-12 leading-relaxed">
        En ImperioPlay puedes cambiar tus juegos por otros del catálogo. Así funciona:
      </p>

      <div class="grid md:grid-cols-3 gap-6">
        <div
          v-for="paso in pasos"
          :key="paso.numero"
          class="bg-bg-card border border-border rounded-lg p-6 flex flex-col gap-3"
        >
          <span class="text-acento-1 text-4xl font-black leading-none">{{ paso.numero }}</span>
          <h3 class="text-lg font-bold">{{ paso.titulo }}</h3>
          <p class="text-sm text-muted leading-relaxed">{{ paso.texto }}</p>
        </div>
      </div>

      <NuxtLink
        to="/catalogo"
        class="inline-block mt-10 text-sm text-acento-1 hover:underline font-bold"
      >
        Ver qué puedes llevarte →
      </NuxtLink>
    </div>
  </section>
</template>
