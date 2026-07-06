<script setup lang="ts">
const route = useRoute()
const { data: consola, error } = await useAsyncData(
  `consola-${route.params.id}`,
  () => useConsolaApi().getOne(Number(route.params.id)),
)

if (!error.value && !consola.value) throw createError({ statusCode: 404, message: 'Consola no encontrada' })

const tieneOferta = computed(() =>
  (consola.value?.descuento_porcentaje ?? 0) > 0 || (consola.value?.descuento_fijo ?? 0) > 0,
)
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 md:px-8 py-10">
    <NuxtLink to="/catalogo/consolas" class="text-sm text-muted hover:text-acento-1 transition-colors mb-8 inline-block">
      ← Volver a consolas
    </NuxtLink>

    <div v-if="error" class="text-muted text-sm py-20 text-center">
      No se pudo cargar el producto. El servidor no está disponible.
    </div>

    <div v-else-if="consola" class="grid md:grid-cols-2 gap-8 mt-4">
      <div class="bg-bg-card rounded-lg overflow-hidden aspect-square flex items-center justify-center text-muted text-sm">
        <img v-if="consola.fotos?.[0]" :src="consola.fotos[0]" :alt="consola.producto.nombre" class="w-full h-full object-cover" />
        <span v-else>Sin foto</span>
      </div>

      <div class="flex flex-col gap-4">
        <div>
          <p class="text-acento-1 text-xs font-bold uppercase tracking-widest mb-1">
            {{ consola.generacion }} · {{ consola.estado }}
          </p>
          <h1 class="text-3xl font-black tracking-tight leading-tight">{{ consola.producto.nombre }}</h1>
        </div>

        <div>
          <p v-if="tieneOferta" class="text-sm text-muted line-through">
            ${{ consola.precio_base.toLocaleString('es-AR') }}
          </p>
          <p class="text-3xl font-black text-acento-1">${{ consola.precio_final.toLocaleString('es-AR') }}</p>
          <span v-if="tieneOferta" class="inline-block mt-1 text-xs font-bold bg-bg-card border border-border px-2 py-0.5 rounded">
            {{ consola.descuento_porcentaje ? `${consola.descuento_porcentaje}% OFF` : `$${consola.descuento_fijo} OFF` }}
          </span>
        </div>

        <span :class="['text-xs font-bold px-2 py-1 rounded w-fit', consola.stock > 2 ? 'bg-bg-card text-fg' : consola.stock > 0 ? 'bg-bg-card text-acento-1' : 'bg-bg-soft text-muted']">
          {{ consola.stock > 0 ? `${consola.stock} en stock` : 'Sin stock' }}
        </span>
      </div>
    </div>
  </div>
</template>
