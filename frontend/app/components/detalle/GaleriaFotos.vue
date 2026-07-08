<script setup lang="ts">
const props = defineProps<{
  fotos?: string[]
  alt: string
  visibles?: number
}>()

const visibles = computed(() => props.visibles ?? 5)
const selectedIndex = ref(0)
const selected = computed(() => props.fotos?.[selectedIndex.value] ?? null)

const thumbsRef = ref<HTMLElement>()

function scroll(dir: 'left' | 'right') {
  const el = thumbsRef.value
  const first = el?.firstElementChild as HTMLElement | null
  if (!el || !first) return
  const gap = parseFloat(getComputedStyle(el).columnGap) || 0
  const step = first.clientWidth + gap
  el.scrollBy({ left: dir === 'right' ? step : -step, behavior: 'smooth' })
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="bg-bg-card rounded-lg overflow-hidden aspect-square flex items-center justify-center text-muted text-sm">
      <img v-if="selected" :src="selected" :alt="alt" class="w-full h-full object-cover" />
      <span v-else>Sin foto</span>
    </div>

    <div v-if="fotos && fotos.length > 1" class="relative group">
      <button
        v-if="fotos.length > visibles"
        class="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-bg-card hover:text-acento-1 rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity flex"
        aria-label="Anterior"
        @click="scroll('left')"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div
        ref="thumbsRef"
        class="flex gap-2 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide"
        :style="{ '--visibles': visibles }"
      >
        <button
          v-for="(foto, i) in fotos"
          :key="i"
          type="button"
          @click="selectedIndex = i"
          :class="[
            'thumb snap-start shrink-0 aspect-square rounded overflow-hidden border-2 transition-colors',
            selectedIndex === i ? 'border-acento-1' : 'border-transparent hover:border-border',
          ]"
        >
          <img :src="foto" :alt="`${alt} ${i + 1}`" class="w-full h-full object-cover" />
        </button>
      </div>

      <button
        v-if="fotos.length > visibles"
        class="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-bg-card hover:text-acento-1 rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity flex"
        aria-label="Siguiente"
        @click="scroll('right')"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.thumb {
  flex-basis: calc((100% - (var(--visibles) - 1) * 0.5rem) / var(--visibles));
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
