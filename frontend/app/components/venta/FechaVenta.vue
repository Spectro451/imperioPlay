<script setup lang="ts">
const props = defineProps<{ iso: string }>()
const texto = computed(() => formatearFecha(props.iso))
</script>

<template>{{ texto }}</template>
