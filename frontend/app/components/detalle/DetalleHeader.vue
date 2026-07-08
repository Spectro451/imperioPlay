<script setup lang="ts">
defineProps<{
  plataforma: string
  estado: string
  nombre: string
  tier?: number
}>()
</script>

<template>
  <div>
    <p class="text-acento-1 text-xs font-bold uppercase tracking-widest mb-1">
      {{ plataforma }} · {{ estado }}<span v-if="tier != null"> · Tier {{ tier }}</span>
    </p>
    <h1 class="text-3xl font-black tracking-tight leading-tight">{{ nombre }}</h1>
  </div>
</template>
