<script setup lang="ts">
withDefaults(defineProps<{ cantidad?: number }>(), { cantidad: 20 })
</script>

<template>
  <div class="grid grid-cols-1 min-[480px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
    <div
      v-for="n in cantidad"
      :key="n"
      class="bg-bg-card rounded-lg overflow-hidden animate-pulse"
    >
      <div class="bg-bg-soft h-44" />
      <div class="p-3 flex flex-col gap-2">
        <div class="h-3 w-1/2 bg-bg-soft rounded" />
        <div class="h-4 w-3/4 bg-bg-soft rounded" />
        <div class="h-4 w-1/3 bg-bg-soft rounded mt-2" />
      </div>
    </div>
  </div>
</template>
