<script setup lang="ts">
definePageMeta({ middleware: 'cuenta' })

const { user, logout } = useAuth()
const esCliente = computed(() => user.value?.rol === 'cliente')
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 md:px-8 py-12">
    <h1 class="text-2xl font-black tracking-tight mb-1">Mi cuenta</h1>
    <p class="text-muted text-sm mb-8">Tu información de acceso.</p>

    <div class="bg-bg-card rounded-lg p-6 flex flex-col gap-4 border border-border">
      <div>
        <p class="text-xs font-semibold uppercase tracking-widest text-muted mb-1">Nombre</p>
        <p class="text-fg font-medium">{{ user?.nombre }}</p>
      </div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-widest text-muted mb-1">Correo</p>
        <p class="text-fg font-medium">{{ user?.correo }}</p>
      </div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-widest text-muted mb-1">Rol</p>
        <p class="text-fg font-medium capitalize">{{ user?.rol }}</p>
      </div>
    </div>

    <div class="mt-6 flex flex-col gap-3 items-start">
      <NuxtLink
        v-if="esCliente"
        to="/cuenta/wishlist"
        class="text-sm text-acento-1 hover:underline transition-colors"
      >
        Ver mi wishlist →
      </NuxtLink>
      <button
        class="text-sm text-muted hover:text-acento-1 transition-colors"
        @click="logout"
      >
        Cerrar sesión →
      </button>
    </div>
  </div>
</template>
