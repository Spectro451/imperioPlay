<script setup lang="ts">
withDefaults(defineProps<{ cantidad?: number }>(), { cantidad: 6 })
</script>

<template>
  <tr
    v-for="n in cantidad"
    :key="n"
    class="border-b border-border last:border-b-0 animate-pulse"
  >
    <td class="px-4 py-3"><div class="h-3 w-32 bg-bg-soft rounded" /></td>
    <td class="px-4 py-3"><div class="h-3 w-40 bg-bg-soft rounded" /></td>
    <td class="px-4 py-3"><div class="h-3 w-24 bg-bg-soft rounded" /></td>
    <td class="px-4 py-3"><div class="h-3 w-16 bg-bg-soft rounded" /></td>
    <td class="px-4 py-3"><div class="h-3 w-16 bg-bg-soft rounded" /></td>
    <td class="px-4 py-3">
      <div class="h-3 w-16 bg-bg-soft rounded ml-auto" />
    </td>
  </tr>
</template>
