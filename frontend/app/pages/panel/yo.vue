<script setup lang="ts">
import { esRutValido, normalizarRut } from '~/utils/rut'

definePageMeta({ middleware: 'panel', layout: 'panel' })

const { user, refresh: refreshAuth } = useAuth()
const { getYo, update, changePassword } = useUsuarioApi()
const { notificar } = useNotify()

const { data: perfil, refresh: refreshPerfil } = await useAsyncData('panel-yo', () => getYo())

const nombre = ref('')
const correo = ref('')
const rut = ref('')

watch(perfil, (p) => {
  if (!p) return
  nombre.value = p.nombre
  correo.value = p.correo
  rut.value = p.rut ?? ''
}, { immediate: true })

const rutError = computed(() => {
  if (!rut.value.trim()) return ''
  return esRutValido(rut.value) ? '' : 'RUT inválido (formato 12345678-9)'
})

const hayCambiosDatos = computed(() => {
  const p = perfil.value
  if (!p) return false
  return nombre.value.trim() !== p.nombre
    || correo.value.trim().toLowerCase() !== p.correo
    || normalizarRut(rut.value) !== (p.rut ?? '')
})

const puedeGuardarDatos = computed(() =>
  nombre.value.trim().length > 0
  && /^\S+@\S+\.\S+$/.test(correo.value)
  && esRutValido(rut.value)
  && hayCambiosDatos.value,
)

const savingDatos = ref(false)

async function guardarDatos() {
  if (!puedeGuardarDatos.value || savingDatos.value || !perfil.value) return
  savingDatos.value = true
  try {
    await update(perfil.value.id, {
      nombre: nombre.value.trim(),
      correo: correo.value.trim().toLowerCase(),
      rut: normalizarRut(rut.value),
    })
    await Promise.all([refreshPerfil(), refreshAuth()])
    notificar('ok', 'Datos actualizados')
  } catch (e: any) {
    notificar('error', e?.data?.message ?? 'No se pudieron actualizar los datos')
  } finally {
    savingDatos.value = false
  }
}

const pwActual = ref('')
const pwNueva = ref('')
const pwConfirm = ref('')
const savingPw = ref(false)

const pwMismatch = computed(
  () => pwConfirm.value.length > 0 && pwNueva.value !== pwConfirm.value,
)

const puedeGuardarPw = computed(
  () => pwActual.value.length >= 6
    && pwNueva.value.length >= 6
    && pwNueva.value === pwConfirm.value,
)

async function guardarPw() {
  if (!puedeGuardarPw.value || savingPw.value || !perfil.value) return
  savingPw.value = true
  try {
    await changePassword(perfil.value.id, pwActual.value, pwNueva.value)
    pwActual.value = ''
    pwNueva.value = ''
    pwConfirm.value = ''
    notificar('ok', 'Contraseña actualizada')
  } catch (e: any) {
    notificar('error', e?.data?.message ?? 'No se pudo cambiar la contraseña')
  } finally {
    savingPw.value = false
  }
}

const labelClass = 'text-xs font-semibold uppercase tracking-widest text-muted mb-1'
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-black tracking-tight mb-1">Mi cuenta</h1>
      <p class="text-muted text-sm">
        Editá tus datos personales o cambiá tu contraseña.
        <span class="ml-1 text-[10px] uppercase tracking-widest text-acento-1 font-bold">
          {{ user?.rol }}
        </span>
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <section class="bg-bg-card border border-border rounded-lg p-6">
        <h2 class="text-lg font-black tracking-tight mb-4">Datos</h2>

        <form class="flex flex-col gap-3" @submit.prevent="guardarDatos">
          <div class="flex flex-col gap-1">
            <label :class="labelClass">Nombre</label>
            <PanelInput v-model="nombre" required class="w-full" :disabled="savingDatos" />
          </div>

          <div class="flex flex-col gap-1">
            <label :class="labelClass">Correo</label>
            <PanelInput v-model="correo" type="email" required class="w-full" :disabled="savingDatos" />
          </div>

          <div class="flex flex-col gap-1">
            <label :class="labelClass">RUT</label>
            <PanelInput v-model="rut" required class="w-full" :disabled="savingDatos" placeholder="12345678-9" />
            <p v-if="rutError" class="text-xs text-danger">{{ rutError }}</p>
          </div>

          <div class="pt-2">
            <button
              type="submit"
              :disabled="savingDatos || !puedeGuardarDatos"
              class="w-full px-4 py-2 text-sm font-bold text-acento-1 border border-acento-1 hover:bg-acento-1 hover:text-bg-hard rounded transition-colors disabled:opacity-50"
            >
              {{ savingDatos ? 'Guardando...' : 'Guardar datos' }}
            </button>
          </div>
        </form>
      </section>

      <section class="bg-bg-card border border-border rounded-lg p-6">
        <h2 class="text-lg font-black tracking-tight mb-4">Cambiar contraseña</h2>

        <form class="flex flex-col gap-3" @submit.prevent="guardarPw">
          <div class="flex flex-col gap-1">
            <label :class="labelClass">Contraseña actual</label>
            <PanelInput v-model="pwActual" type="password" required minlength="6" class="w-full" :disabled="savingPw" />
          </div>

          <div class="flex flex-col gap-1">
            <label :class="labelClass">Nueva contraseña</label>
            <PanelInput v-model="pwNueva" type="password" required minlength="6" class="w-full" :disabled="savingPw" placeholder="Mínimo 6 caracteres" />
            <p v-if="pwNueva.length > 0 && pwNueva.length < 6" class="text-xs text-danger">
              Debe tener al menos 6 caracteres
            </p>
          </div>

          <div class="flex flex-col gap-1">
            <label :class="labelClass">Confirmar nueva contraseña</label>
            <PanelInput v-model="pwConfirm" type="password" required class="w-full" :disabled="savingPw" />
            <p v-if="pwMismatch" class="text-xs text-danger">
              Las contraseñas no coinciden
            </p>
          </div>

          <div class="pt-2">
            <button
              type="submit"
              :disabled="savingPw || !puedeGuardarPw"
              class="w-full px-4 py-2 text-sm font-bold text-acento-1 border border-acento-1 hover:bg-acento-1 hover:text-bg-hard rounded transition-colors disabled:opacity-50"
            >
              {{ savingPw ? 'Guardando...' : 'Cambiar contraseña' }}
            </button>
          </div>
        </form>
      </section>
    </div>
  </div>
</template>
