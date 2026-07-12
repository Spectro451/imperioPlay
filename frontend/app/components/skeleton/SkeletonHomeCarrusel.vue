<script setup lang="ts">
withDefaults(defineProps<{ cantidad?: number }>(), { cantidad: 6 })
</script>

<template>
  <div class="flex gap-4 overflow-hidden pb-2">
    <div
      v-for="n in cantidad"
      :key="n"
      :class="[
        'shrink-0 bg-bg-card rounded-lg overflow-hidden animate-pulse',
        n === 1 ? 'w-64 md:w-80 ml-4 md:ml-8' : 'w-44 md:w-56',
        n === cantidad && 'mr-4 md:mr-8',
      ]"
    >
      <div :class="['bg-bg-soft', n === 1 ? 'h-44 md:h-60' : 'h-44']" />
      <div class="p-3 flex flex-col gap-2">
        <div class="h-3 w-1/2 bg-bg-soft rounded" />
        <div class="h-4 w-3/4 bg-bg-soft rounded" />
        <div class="h-4 w-1/3 bg-bg-soft rounded mt-2" />
      </div>
    </div>
  </div>
</template>
