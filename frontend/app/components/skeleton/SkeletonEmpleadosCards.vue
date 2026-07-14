<script setup lang="ts">
withDefaults(defineProps<{ cantidad?: number }>(), { cantidad: 5 })
</script>

<template>
  <div class="flex flex-col gap-3">
    <div
      v-for="n in cantidad"
      :key="n"
      class="bg-bg-card border border-border rounded-lg p-4 flex flex-col gap-3 animate-pulse"
    >
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0 flex-1 flex flex-col gap-2">
          <div class="h-4 w-2/3 bg-bg-soft rounded" />
          <div class="h-3 w-1/2 bg-bg-soft rounded" />
        </div>
        <div class="h-4 w-16 bg-bg-soft rounded shrink-0" />
      </div>
      <div class="flex items-center justify-between">
        <div class="h-3 w-20 bg-bg-soft rounded" />
        <div class="h-3 w-14 bg-bg-soft rounded" />
      </div>
    </div>
  </div>
</template>
