<script setup lang="ts">
const route = useRoute()
const { data: juego, error } = await useAsyncData(
  `juego-${route.params.id}`,
  () => useJuegoApi().getOne(Number(route.params.id)),
)

if (!error.value && !juego.value) throw createError({ statusCode: 404, message: 'Juego no encontrado' })

const tieneOferta = computed(() =>
  (juego.value?.descuento_porcentaje ?? 0) > 0 || (juego.value?.descuento_fijo ?? 0) > 0,
)
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 md:px-8 py-10">
    <NuxtLink to="/catalogo/juegos" class="text-sm text-muted hover:text-acento-1 transition-colors mb-8 inline-block">
      ← Volver a juegos
    </NuxtLink>

    <div v-if="error" class="text-muted text-sm py-20 text-center">
      No se pudo cargar el producto. El servidor no está disponible.
    </div>

    <div v-else-if="juego" class="grid md:grid-cols-2 gap-8 mt-4">
      <div class="bg-bg-card rounded-lg overflow-hidden aspect-square flex items-center justify-center text-muted text-sm">
        <img v-if="juego.fotos?.[0]" :src="juego.fotos[0]" :alt="juego.producto.nombre" class="w-full h-full object-cover" />
        <span v-else>Sin foto</span>
      </div>

      <div class="flex flex-col gap-4">
        <div>
          <p class="text-acento-1 text-xs font-bold uppercase tracking-widest mb-1">
            {{ juego.consola }} · {{ juego.estado }}
          </p>
          <h1 class="text-3xl font-black tracking-tight leading-tight">{{ juego.producto.nombre }}</h1>
        </div>

        <div>
          <p v-if="tieneOferta" class="text-sm text-muted line-through">
            ${{ juego.precio_base.toLocaleString('es-AR') }}
          </p>
          <p class="text-3xl font-black text-acento-1">${{ juego.precio_final.toLocaleString('es-AR') }}</p>
          <span v-if="tieneOferta" class="inline-block mt-1 text-xs font-bold bg-bg-card border border-border px-2 py-0.5 rounded">
            {{ juego.descuento_porcentaje ? `${juego.descuento_porcentaje}% OFF` : `$${juego.descuento_fijo} OFF` }}
          </span>
        </div>

        <span :class="['text-xs font-bold px-2 py-1 rounded w-fit', juego.stock > 2 ? 'bg-bg-card text-fg' : juego.stock > 0 ? 'bg-bg-card text-acento-1' : 'bg-bg-soft text-muted']">
          {{ juego.stock > 0 ? `${juego.stock} en stock` : 'Sin stock' }}
        </span>
      </div>
    </div>
  </div>
</template>
