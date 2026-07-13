<script setup lang="ts">
const props = defineProps<{ iso: string }>()

const texto = ref('')

function actualizar() {
  texto.value = formatearFecha(props.iso)
}

onMounted(actualizar)
watch(() => props.iso, actualizar)
</script>

<template>{{ texto }}</template>
