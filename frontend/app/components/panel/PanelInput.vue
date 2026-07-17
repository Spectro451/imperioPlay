<script setup lang="ts">
defineProps<{
  modelValue?: string | number
  placeholder?: string
  type?: string
  disabled?: boolean
}>()

defineEmits<{
  (e: 'update:modelValue', v: string): void
}>()
</script>

<template>
  <input
    :value="modelValue"
    :type="type ?? 'text'"
    :placeholder="placeholder"
    :disabled="disabled"
    class="bg-bg-card border border-border text-sm text-fg rounded px-3 py-2 focus:outline-none focus:border-acento-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
