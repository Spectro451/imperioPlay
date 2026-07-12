<script setup lang="ts">
const correo = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const { login } = useAuthApi()
const { refresh, isStaff } = useAuth()

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await login(correo.value, password.value)
    await refresh()
    await navigateTo(isStaff.value ? '/panel' : '/cuenta')
  } catch (e: any) {
    const msg = e?.data?.message
    error.value = Array.isArray(msg) ? msg[0] : (msg ?? 'Credenciales invalidas')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
    <div class="w-full max-w-sm">
      <h1 class="text-2xl font-black tracking-tight mb-1">Iniciar sesión</h1>
      <p class="text-muted text-sm mb-8">Accedé a tu cuenta ImperioPlay.</p>

      <form class="flex flex-col gap-4" @submit.prevent="submit">
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
            :disabled="loading"
            class="bg-bg-card border border-border rounded px-3 py-2 text-sm text-fg focus:outline-none focus:border-acento-1 transition-colors disabled:opacity-50"
            placeholder="••••••••"
          />
        </div>

        <p v-if="error" class="text-sm text-red-500">{{ error }}</p>

        <button
          type="submit"
          :disabled="loading"
          class="mt-2 px-6 py-3 border border-acento-1 text-acento-1 font-bold rounded-lg hover:bg-acento-1 hover:text-bg-hard transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>
    </div>
  </div>
</template>
