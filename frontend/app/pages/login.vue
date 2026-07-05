<script setup lang="ts">
const correo = ref('')
const password = ref('')
const error = ref('')

async function submit() {
  error.value = ''
  // TODO: conectar a useAuthApi
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
            class="bg-bg-card border border-border rounded px-3 py-2 text-sm text-fg focus:outline-none focus:border-acento-1 transition-colors"
            placeholder="tu@correo.com"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold uppercase tracking-widest text-muted">Contraseña</label>
          <input
            v-model="password"
            type="password"
            required
            class="bg-bg-card border border-border rounded px-3 py-2 text-sm text-fg focus:outline-none focus:border-acento-1 transition-colors"
            placeholder="••••••••"
          />
        </div>

        <p v-if="error" class="text-sm text-red-500">{{ error }}</p>

        <button
          type="submit"
          class="mt-2 px-6 py-3 border border-acento-1 text-acento-1 font-bold rounded-lg hover:bg-acento-1 hover:text-bg-hard transition-colors text-sm"
        >
          Entrar
        </button>
      </form>
    </div>
  </div>
</template>
