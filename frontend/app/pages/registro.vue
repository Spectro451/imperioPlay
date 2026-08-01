<script setup lang="ts">
const nombre = ref('')
const correo = ref('')
const password = ref('')
const password2 = ref('')
const error = ref('')
const loading = ref(false)

const { registro, login } = useAuthApi()
const { refresh, user } = useAuth()

async function submit() {
  error.value = ''
  if (password.value.length < 6) {
    error.value = 'La contraseña debe tener al menos 6 caracteres'
    return
  }
  if (password.value !== password2.value) {
    error.value = 'Las contraseñas no coinciden'
    return
  }
  loading.value = true
  try {
    await registro(nombre.value.trim(), correo.value.trim(), password.value)
    await login(correo.value.trim(), password.value)
    await refresh()
    if (user.value?.rol === 'cliente') {
      await useWishlist().cargar(true)
    }
    await navigateTo('/cuenta')
  } catch (e: any) {
    const msg = e?.data?.message
    error.value = Array.isArray(msg) ? msg[0] : (msg ?? 'No se pudo crear la cuenta')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-sm">
      <h1 class="text-2xl font-black tracking-tight mb-1">Crear cuenta</h1>
      <p class="text-muted text-sm mb-8">Regístrate como cliente para guardar tus favoritos.</p>

      <form class="flex flex-col gap-4" @submit.prevent="submit">
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold uppercase tracking-widest text-muted">Nombre</label>
          <input
            v-model="nombre"
            type="text"
            required
            minlength="2"
            :disabled="loading"
            class="bg-bg-card border border-border rounded px-3 py-2 text-sm text-fg focus:outline-none focus:border-acento-1 transition-colors disabled:opacity-50"
            placeholder="Tu nombre"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold uppercase tracking-widest text-muted">Correo</label>
          <input
            v-model="correo"
            type="email"
            required
            :disabled="loading"
            class="bg-bg-card border border-border rounded px-3 py-2 text-sm text-fg focus:outline-none focus:border-acento-1 transition-colors disabled:opacity-50"
            placeholder="tu@correo.com"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold uppercase tracking-widest text-muted">Contraseña</label>
          <input
            v-model="password"
            type="password"
            required
            minlength="6"
            :disabled="loading"
            class="bg-bg-card border border-border rounded px-3 py-2 text-sm text-fg focus:outline-none focus:border-acento-1 transition-colors disabled:opacity-50"
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold uppercase tracking-widest text-muted">Repetir contraseña</label>
          <input
            v-model="password2"
            type="password"
            required
            minlength="6"
            :disabled="loading"
            class="bg-bg-card border border-border rounded px-3 py-2 text-sm text-fg focus:outline-none focus:border-acento-1 transition-colors disabled:opacity-50"
            placeholder="••••••••"
          />
        </div>

        <p v-if="error" class="text-sm text-danger">{{ error }}</p>

        <button
          type="submit"
          :disabled="loading"
          class="mt-2 px-6 py-3 border border-acento-1 text-acento-1 font-bold rounded-lg hover:bg-acento-1 hover:text-bg-hard transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Creando...' : 'Crear cuenta' }}
        </button>

        <p class="text-sm text-muted text-center mt-2">
          ¿Ya tienes cuenta?
          <NuxtLink to="/login" class="text-acento-1 hover:underline">Inicia sesión</NuxtLink>
        </p>
      </form>
    </div>
  </div>
</template>
