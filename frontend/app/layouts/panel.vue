<script setup lang="ts">
const { user, isAdmin, logout } = useAuth()

const links = [
  { label: 'Dashboard', to: '/panel' },
  { label: 'Productos', to: '/panel/productos' },
  { label: 'Registrar venta', to: '/panel/ventas' },
  { label: 'Registrar intercambio', to: '/panel/intercambios' },
  { label: 'Yo', to: '/panel/yo' },
]

const adminLinks = [
  { label: 'Usuarios', to: '/panel/admin/usuarios' },
  { label: 'Ventas', to: '/panel/admin/ventas' },
  { label: 'Intercambios', to: '/panel/admin/intercambios' },
  { label: 'Reportes', to: '/panel/admin/reportes' },
]

const sidebarAbierto = ref(false)
const route = useRoute()
watch(() => route.path, () => { sidebarAbierto.value = false })
</script>

<template>
  <div class="min-h-screen bg-bg-base text-fg flex">
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-40 w-64 bg-bg-hard border-r border-border flex flex-col transition-transform duration-200',
        sidebarAbierto ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
      ]"
    >
      <div class="h-16 px-6 flex items-center border-b border-border shrink-0">
        <NuxtLink to="/" class="font-black text-lg tracking-tight">
          Imperio<span class="text-acento-1">Play</span>
        </NuxtLink>
      </div>

      <nav class="flex-1 py-6 px-3 flex flex-col gap-1 overflow-y-auto">
        <p class="px-3 py-2 text-sm font-bold text-acento-1 border-b border-border">Operaciones</p>
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="px-3 py-2 text-sm text-muted hover:text-fg hover:bg-bg-card rounded transition-colors"
          active-class="!text-fg !bg-bg-card"
          exact-active-class="!text-acento-1 !bg-bg-card"
        >
          {{ link.label }}
        </NuxtLink>

        <template v-if="isAdmin">
          <p class="px-3 py-2 mt-6 text-sm font-bold text-acento-1 border-b border-border">Administración</p>
          <NuxtLink
            v-for="link in adminLinks"
            :key="link.to"
            :to="link.to"
            class="px-3 py-2 text-sm text-muted hover:text-fg hover:bg-bg-card rounded transition-colors"
            active-class="!text-fg !bg-bg-card"
          >
            {{ link.label }}
          </NuxtLink>
        </template>
      </nav>

      <div class="border-t border-border p-4 flex flex-col gap-1">
        <p class="text-sm font-semibold truncate">{{ user?.nombre }}</p>
        <p class="text-xs text-muted truncate">{{ user?.correo }}</p>
        <p class="text-[10px] uppercase tracking-widest text-acento-1 font-bold mt-1">{{ user?.rol }}</p>
        <button
          class="mt-2 text-xs text-muted hover:text-acento-1 transition-colors text-left"
          @click="logout"
        >
          Cerrar sesión →
        </button>
      </div>
    </aside>

    <div class="flex-1 md:ml-64 min-w-0 flex flex-col">
      <header class="md:hidden h-16 px-4 flex items-center border-b border-border bg-bg-hard">
        <button
          class="p-1 text-fg"
          aria-label="Abrir menú"
          @click="sidebarAbierto = !sidebarAbierto"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
        <span class="ml-4 font-black tracking-tight">Panel</span>
      </header>

      <main class="flex-1 p-6 md:p-10">
        <Notificador />
        <slot />
      </main>
    </div>

    <div
      v-if="sidebarAbierto"
      class="fixed inset-0 z-30 bg-black/50 md:hidden"
      @click="sidebarAbierto = false"
    />
  </div>
</template>
