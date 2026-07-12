<script setup lang="ts">
withDefaults(defineProps<{ cantidad?: number }>(), { cantidad: 10 })
</script>

<template>
  <tr
    v-for="n in cantidad"
    :key="n"
    class="border-b border-border last:border-b-0 animate-pulse"
  >
    <td class="px-4 py-3"><div class="h-3 w-32 bg-bg-soft rounded" /></td>
    <td class="px-4 py-3"><div class="h-3 w-16 bg-bg-soft rounded" /></td>
    <td class="px-4 py-3"><div class="h-3 w-12 bg-bg-soft rounded" /></td>
    <td class="px-4 py-3"><div class="h-3 w-16 bg-bg-soft rounded" /></td>
    <td class="px-4 py-3"><div class="h-3 w-14 bg-bg-soft rounded" /></td>
    <td class="px-4 py-3"><div class="h-3 w-6 bg-bg-soft rounded ml-auto" /></td>
    <td class="px-4 py-3"><div class="h-4 w-20 bg-bg-soft rounded ml-auto" /></td>
    <td class="px-4 py-3">
      <div class="flex gap-2 justify-end">
        <div class="h-3 w-10 bg-bg-soft rounded" />
        <div class="h-3 w-14 bg-bg-soft rounded" />
      </div>
    </td>
  </tr>
</template>
