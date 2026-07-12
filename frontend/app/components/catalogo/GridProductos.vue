<script setup lang="ts">
defineProps<{
  items: ItemFlat[]
  page: number
  totalPages: number
  loading?: boolean
}>()

defineEmits<{
  'update:page': [page: number]
}>()
</script>

<template>
  <div>
    <SkeletonCatalogoGrid v-if="loading" />

    <div v-else-if="items.length" class="grid grid-cols-1 min-[480px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <TarjetaProducto
        v-for="item in items"
        :key="`${item.tipo}-${item.id}`"
        :item="item"
        fluid
      />
    </div>

    <p v-else class="text-muted text-sm py-16 text-center">Sin resultados.</p>

    <Paginacion :page="page" :total-pages="totalPages" @update:page="$emit('update:page', $event)" />
  </div>
</template>
