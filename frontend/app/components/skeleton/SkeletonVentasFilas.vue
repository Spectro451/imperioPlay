<script setup lang="ts">
withDefaults(defineProps<{ cantidad?: number }>(), { cantidad: 8 })
</script>

<template>
  <tr
    v-for="n in cantidad"
    :key="n"
    class="border-b border-border last:border-b-0 animate-pulse"
  >
    <td class="px-4 py-3"><div class="h-3 w-3 bg-bg-soft rounded" /></td>
    <td class="px-4 py-3"><div class="h-3 w-36 bg-bg-soft rounded" /></td>
    <td class="px-4 py-3"><div class="h-3 w-28 bg-bg-soft rounded" /></td>
    <td class="px-4 py-3"><div class="h-3 w-20 bg-bg-soft rounded" /></td>
    <td class="px-4 py-3"><div class="h-3 w-12 bg-bg-soft rounded ml-auto" /></td>
    <td class="px-4 py-3"><div class="h-4 w-20 bg-bg-soft rounded ml-auto" /></td>
  </tr>
</template>
