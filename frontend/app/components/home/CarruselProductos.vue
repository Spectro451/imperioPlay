<script setup lang="ts">
defineProps<{
  titulo: string
  items: ItemFlat[]
  verTodosLink?: string
  loading?: boolean
}>()

const carouselRef = ref<HTMLElement>()

function scroll(dir: 'left' | 'right') {
  carouselRef.value?.scrollBy({ left: dir === 'right' ? 300 : -300, behavior: 'smooth' })
}
</script>

<template>
  <section class="py-10">
    <div class="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between mb-5">
      <h2 class="text-2xl font-black tracking-tight">{{ titulo }}</h2>
      <NuxtLink
        v-if="verTodosLink"
        :to="verTodosLink"
        class="text-sm text-muted hover:text-acento-1 transition-colors"
      >
        Ver todos →
      </NuxtLink>
    </div>

    <div class="relative group">
      <button
        class="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-bg-card hover:text-acento-1 rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex"
        aria-label="Anterior"
        @click="scroll('left')"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>

      <SkeletonHomeCarrusel v-if="loading" />

      <div
        v-else
        ref="carouselRef"
        class="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory scroll-pl-4 md:scroll-pl-8 pb-2 scrollbar-hide"
      >
        <TarjetaProducto
          v-for="(item, i) in items"
          :key="`${item.tipo}-${item.id}`"
          :item="item"
          :featured="i === 0"
          :class="['snap-start shrink-0', i === 0 && 'ml-4 md:ml-8', i === items.length - 1 && 'mr-4 md:mr-8']"
        />

        <div v-if="items.length === 0" class="text-muted text-sm py-8 px-2">
          Sin productos disponibles.
        </div>
      </div>

      <button
        class="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-bg-card hover:text-acento-1 rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex"
        aria-label="Siguiente"
        @click="scroll('right')"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </button>
    </div>
  </section>
</template>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
