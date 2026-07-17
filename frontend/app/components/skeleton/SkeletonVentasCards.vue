<script setup lang="ts">
withDefaults(defineProps<{ count?: number }>(), { count: 6 })
</script>

<template>
  <div
    v-for="n in count"
    :key="n"
    class="bg-bg-card border border-border rounded-lg p-4 animate-pulse flex flex-col gap-2"
  >
    <div class="h-3 w-32 bg-bg-soft rounded" />
    <div class="h-3 w-24 bg-bg-soft rounded" />
    <div class="h-4 w-20 bg-bg-soft rounded ml-auto" />
  </div>
</template>
