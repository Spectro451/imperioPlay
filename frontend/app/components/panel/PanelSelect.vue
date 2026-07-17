<script setup lang="ts">
defineProps<{
  modelValue?: string | number
  disabled?: boolean
}>()

defineEmits<{
  (e: 'update:modelValue', v: string): void
}>()
</script>

<template>
  <select
    :value="modelValue"
    :disabled="disabled"
    class="bg-bg-card border border-border text-sm text-fg rounded px-3 py-2 focus:outline-none focus:border-acento-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
  >
    <slot />
  </select>
</template>
