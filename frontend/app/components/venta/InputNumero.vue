<script setup lang="ts">
const props = defineProps<{
  modelValue: number
  placeholder?: string
  disabled?: boolean
  min?: number
  max?: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: number): void
}>()

const textoInterno = ref(String(props.modelValue || ''))

watch(() => props.modelValue, (nuevo) => {
  const actual = textoInterno.value === '' ? 0 : Number(textoInterno.value)
  if (actual !== nuevo) textoInterno.value = nuevo === 0 ? '' : String(nuevo)
})

function onInput(e: Event) {
  const el = e.target as HTMLInputElement
  const filtrado = el.value.replace(/\D/g, '')
  if (filtrado !== el.value) el.value = filtrado
  textoInterno.value = filtrado
  emit('update:modelValue', filtrado === '' ? 0 : Number(filtrado))
}

function onBlur() {
  if (textoInterno.value === '') return
  const n = Number(textoInterno.value)
  if (props.max !== undefined && n > props.max) {
    textoInterno.value = String(props.max)
    emit('update:modelValue', props.max)
  }
  if (props.min !== undefined && n < props.min) {
    textoInterno.value = String(props.min)
    emit('update:modelValue', props.min)
  }
}
</script>

<template>
  <input
    :value="textoInterno"
    type="text"
    inputmode="numeric"
    autocomplete="off"
    :placeholder="placeholder"
    :disabled="disabled"
    class="bg-bg-hard border border-border text-sm text-fg rounded px-3 py-2 focus:outline-none focus:border-acento-1 transition-colors w-full"
    @input="onInput"
    @blur="onBlur"
  />
</template>
