<script setup lang="ts">
defineProps<{ stock: number }>()
</script>

<template>
  <span
    :class="[
      'text-xs font-bold px-2 py-1 rounded w-fit',
      stock > 2
        ? 'bg-bg-card text-fg'
        : stock > 0
          ? 'bg-bg-card text-acento-1'
          : 'bg-bg-soft text-muted',
    ]"
  >
    {{ stock > 0 ? `${stock} en stock` : 'Sin stock' }}
  </span>
</template>
