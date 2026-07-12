<script setup lang="ts">
const { isLoggedIn, isStaff } = useAuth()
const menuAbierto = ref(false)

const links = [
  { label: 'Catálogo', to: '/catalogo' },
  { label: 'Juegos', to: '/catalogo/juegos' },
  { label: 'Consolas', to: '/catalogo/consolas' },
  { label: 'Ofertas', to: '/ofertas' },
]

const route = useRoute()
watch(() => route.path, () => { menuAbierto.value = false })
</script>

<template>
  <div class="min-h-screen bg-bg-base text-fg">
    <nav class="fixed top-0 inset-x-0 z-50 h-16 bg-bg-hard border-b border-border">
      <div class="max-w-7xl mx-auto h-full px-4 md:px-8 flex items-center gap-8">
        <NuxtLink to="/" class="font-black text-xl tracking-tight shrink-0">
          ImperioPlay
        </NuxtLink>

        <div class="hidden md:flex items-center gap-6 flex-1">
          <NuxtLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="text-sm text-muted hover:text-acento-1 transition-colors font-medium"
            active-class="!text-fg"
          >
            {{ link.label }}
          </NuxtLink>
        </div>

        <div class="hidden md:flex items-center gap-3 ml-auto">
          <NuxtLink
            v-if="isStaff"
            to="/panel"
            class="text-sm text-muted hover:text-acento-1 transition-colors"
          >
            Panel
          </NuxtLink>
          <NuxtLink
            :to="isLoggedIn ? '/cuenta' : '/login'"
            class="text-sm text-acento-1 px-4 py-1.5 border border-acento-1 rounded hover:bg-acento-1 hover:text-bg-hard transition-colors"
          >
            {{ isLoggedIn ? 'Mi cuenta' : 'Iniciar sesión' }}
          </NuxtLink>
        </div>

        <button
          class="md:hidden ml-auto p-1 text-fg"
          aria-label="Abrir menú"
          @click="menuAbierto = !menuAbierto"
        >
          <svg v-if="!menuAbierto" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </nav>

    <Transition name="slide-down">
      <div
        v-if="menuAbierto"
        class="fixed top-16 inset-x-0 z-40 bg-bg-hard border-b border-border px-4 py-5 flex flex-col gap-4 md:hidden"
      >
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="text-muted hover:text-acento-1 transition-colors font-medium"
          active-class="!text-fg"
        >
          {{ link.label }}
        </NuxtLink>
        <div class="border-t border-border pt-4 flex flex-col gap-3">
          <NuxtLink v-if="isStaff" to="/panel" class="text-muted hover:text-acento-1">
            Panel
          </NuxtLink>
          <NuxtLink
            :to="isLoggedIn ? '/cuenta' : '/login'"
            class="text-muted hover:text-acento-1 transition-colors"
            active-class="!text-fg !font-medium"
          >
            {{ isLoggedIn ? 'Mi cuenta' : 'Iniciar sesión' }}
          </NuxtLink>
        </div>
      </div>
    </Transition>

    <main class="pt-16">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
