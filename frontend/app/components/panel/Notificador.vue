<script setup lang="ts">
const { mensaje } = useNotify()
</script>

<template>
  <div
    v-if="mensaje"
    class="mb-4 px-4 py-2 rounded border text-sm"
    :class="mensaje.tipo === 'error'
      ? 'border-danger text-danger bg-danger/10'
      : 'border-acento-1 text-acento-1 bg-acento-1/10'"
  >
    {{ mensaje.texto }}
  </div>
</template>
