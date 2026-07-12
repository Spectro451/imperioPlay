<script setup lang="ts">
definePageMeta({ middleware: 'panel', layout: 'panel' })
const { user } = useAuth()
</script>

<template>
  <div>
    <h1 class="text-3xl md:text-4xl font-black tracking-tight mb-2">
      Hola, {{ user?.nombre }}
    </h1>
    <p class="text-muted mb-10">Bienvenido al panel de gestión de ImperioPlay.</p>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <NuxtLink
        to="/panel/productos"
        class="bg-bg-card border border-border rounded-lg p-6 hover:border-acento-1 transition-colors"
      >
        <h2 class="text-lg font-bold mb-1">Productos</h2>
        <p class="text-sm text-muted">Gestionar juegos y consolas.</p>
      </NuxtLink>

      <NuxtLink
        to="/panel/ventas"
        class="bg-bg-card border border-border rounded-lg p-6 hover:border-acento-1 transition-colors"
      >
        <h2 class="text-lg font-bold mb-1">Ventas</h2>
        <p class="text-sm text-muted">Procesar ventas al mostrador.</p>
      </NuxtLink>

      <NuxtLink
        to="/panel/intercambios"
        class="bg-bg-card border border-border rounded-lg p-6 hover:border-acento-1 transition-colors"
      >
        <h2 class="text-lg font-bold mb-1">Intercambios</h2>
        <p class="text-sm text-muted">Gestionar intercambios de juegos.</p>
      </NuxtLink>
    </div>
  </div>
</template>
