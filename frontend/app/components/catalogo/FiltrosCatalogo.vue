<script setup lang="ts">
const props = defineProps<{
  filtros: { busqueda: string; plataforma: string; estado: string; orden: string }
  tipo?: 'juego' | 'consola' | 'todos'
}>()

const plataformasJuego = ['Xbox360', 'XboxOne', 'XboxSeries', 'Ps3', 'Ps4', 'Ps5', 'Switch', 'Switch2']
const plataformasConsola = ['Gen 8', 'Gen 9']

const plataformas = computed(() => {
  if (props.tipo === 'juego') return plataformasJuego
  if (props.tipo === 'consola') return plataformasConsola
  return [...plataformasJuego, ...plataformasConsola]
})

const ordenes = [
  { label: 'Más recientes', value: 'id-desc' },
  { label: 'A → Z', value: 'abc' },
  { label: 'Menor precio', value: 'precio-asc' },
  { label: 'Mayor precio', value: 'precio-desc' },
]

const selectClass = 'bg-bg-card border border-border text-sm text-fg rounded px-3 py-1.5 focus:outline-none focus:border-acento-1 transition-colors'
</script>

<template>
  <div class="flex flex-wrap gap-3 items-center">
    <input
      v-model="filtros.busqueda"
      type="text"
      placeholder="Buscar..."
      class="bg-bg-card border border-border text-sm text-fg rounded px-3 py-1.5 focus:outline-none focus:border-acento-1 transition-colors w-48"
    />

    <select v-model="filtros.plataforma" :class="selectClass">
      <option value="">Plataforma</option>
      <option v-for="p in plataformas" :key="p" :value="p">{{ p }}</option>
    </select>

    <select v-model="filtros.estado" :class="selectClass">
      <option value="">Estado</option>
      <option value="nuevo">Nuevo</option>
      <option value="usado">Usado</option>
    </select>

    <select v-model="filtros.orden" :class="selectClass">
      <option v-for="o in ordenes" :key="o.value" :value="o.value">{{ o.label }}</option>
    </select>

    <button
      v-if="filtros.busqueda || filtros.plataforma || filtros.estado || filtros.orden !== 'id-desc'"
      class="text-xs text-muted hover:text-acento-1 transition-colors"
      @click="Object.assign(filtros, { busqueda: '', plataforma: '', estado: '', orden: 'id-desc' })"
    >
      Limpiar filtros
    </button>
  </div>
</template>
