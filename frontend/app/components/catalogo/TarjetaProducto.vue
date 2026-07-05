<script setup lang="ts">
const props = defineProps<{
  item: ItemFlat
  featured?: boolean
  fluid?: boolean
}>()

const tieneOferta = computed(
  () => (props.item.descuento_porcentaje ?? 0) > 0 || (props.item.descuento_fijo ?? 0) > 0,
)
const link = computed(() => `/${props.item.tipo}/${props.item.id}`)
const foto = computed(() => props.item.fotos?.[0] ?? null)
</script>

<template>
  <NuxtLink
    :to="link"
    :class="[
      'group bg-bg-card rounded-lg overflow-hidden flex flex-col transition-transform duration-200 hover:scale-[1.02]',
      fluid ? 'w-full' : featured ? 'w-64 md:w-80' : 'w-44 md:w-56',
    ]"
  >
    <!-- Imagen -->
    <div
      :class="[
        'bg-bg-soft relative overflow-hidden',
        featured ? 'h-44 md:h-60' : 'h-44',
      ]"
    >
      <img
        v-if="foto"
        :src="foto"
        :alt="item.nombre"
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-muted text-xs select-none">
        Sin foto
      </div>

      <span
        v-if="tieneOferta"
        class="absolute top-2 left-2 bg-acento-1 text-bg-hard text-xs font-bold px-2 py-0.5 rounded"
      >
        OFERTA
      </span>
      <span
        v-if="item.stock > 0 && item.stock <= 2"
        class="absolute top-2 right-2 bg-bg-hard text-acento-1 text-xs font-bold px-2 py-0.5 rounded"
      >
        Últimas {{ item.stock }}
      </span>
      <span
        v-if="item.stock === 0"
        class="absolute top-2 right-2 bg-bg-soft text-muted text-xs font-bold px-2 py-0.5 rounded"
      >
        Sin stock
      </span>
    </div>

    <!-- Info -->
    <div class="p-3 flex flex-col gap-1 flex-1">
      <p class="text-xs text-muted">{{ item.plataforma }} · {{ item.estado }}</p>
      <h3 class="text-sm font-semibold leading-tight line-clamp-2">{{ item.nombre }}</h3>
      <div class="mt-auto pt-2 flex flex-col">
        <p v-if="tieneOferta" class="text-xs text-muted line-through">
          ${{ item.precio_base.toLocaleString('es-AR') }}
        </p>
        <p class="text-base font-bold text-acento-1">
          ${{ item.precio_final.toLocaleString('es-AR') }}
        </p>
      </div>
    </div>
  </NuxtLink>
</template>
