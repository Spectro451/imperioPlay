<script setup lang="ts">
import type { Usuario } from '~/composables/api/useUsuarioApi'
import type { SortCol } from '~/components/panel/TablaEmpleados.vue'

definePageMeta({ middleware: 'admin', layout: 'panel' })

const { getEmpleados, remove: removeUsuario, reactivar: reactivarUsuario } = useUsuarioApi()
const { user } = useAuth()
const { notificar } = useNotify()

const busqueda = ref('')
const rolFiltro = ref<'todos' | 'empleado' | 'admin'>('todos')
const activoFiltro = ref<'todos' | 'true' | 'false'>('todos')

const { sortCol, sortDir, toggleSort } = useTriStateSort<SortCol>({
  defaultCol: 'id',
  ascCols: ['nombre'],
})

const busquedaDebounced = useDebouncedRef(busqueda)

const { data, pending, refresh } = await useAsyncData('panel-empleados', () => getEmpleados())

const empleados = computed(() => {
  const lista = data.value ?? []
  const q = busquedaDebounced.value.trim().toLowerCase()

  const filtrados = lista.filter((e) => {
    if (rolFiltro.value !== 'todos' && e.rol !== rolFiltro.value) return false
    if (activoFiltro.value === 'true' && !e.isActive) return false
    if (activoFiltro.value === 'false' && e.isActive) return false
    if (q) {
      const hit = e.nombre.toLowerCase().includes(q)
        || e.correo.toLowerCase().includes(q)
        || (e.rut ?? '').toLowerCase().includes(q)
      if (!hit) return false
    }
    return true
  })

  const dir = sortDir.value === 'asc' ? 1 : -1
  return [...filtrados].sort((a, b) => {
    if (sortCol.value === 'nombre') return a.nombre.localeCompare(b.nombre) * dir
    return (a.id - b.id) * dir
  })
})

const modalAbierto = ref(false)
const empleadoEditando = ref<Usuario | null>(null)
const empleadoReset = ref<Usuario | null>(null)

function abrirNuevo() {
  empleadoEditando.value = null
  modalAbierto.value = true
}

function editar(empleado: Usuario) {
  empleadoEditando.value = empleado
  modalAbierto.value = true
}

function cerrarModal() {
  modalAbierto.value = false
  empleadoEditando.value = null
}

async function onSaved() {
  const editando = !!empleadoEditando.value
  cerrarModal()
  notificar('ok', editando ? 'Empleado actualizado' : 'Empleado creado')
  await refresh()
}

function abrirReset(empleado: Usuario) {
  empleadoReset.value = empleado
}

function cerrarReset() {
  empleadoReset.value = null
}

async function onResetSaved() {
  cerrarReset()
  notificar('ok', 'Contraseña actualizada')
}

async function eliminar(empleado: Usuario) {
  if (empleado.id === user.value?.id) {
    notificar('error', 'No podés desactivar tu propia cuenta')
    return
  }
  if (!confirm('Esto desactivará la cuenta impidiendo su acceso, ¿estás seguro?')) return
  try {
    await removeUsuario(empleado.id)
    await refresh()
  } catch (e: any) {
    notificar('error', e?.data?.message ?? 'Error al desactivar')
  }
}

async function reactivar(empleado: Usuario) {
  try {
    await reactivarUsuario(empleado.id)
    await refresh()
  } catch (e: any) {
    notificar('error', e?.data?.message ?? 'Error al reactivar')
  }
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-8 gap-4 flex-wrap">
      <div>
        <h1 class="text-3xl font-black tracking-tight mb-1">Usuarios</h1>
        <p class="text-muted text-sm">Gestionar empleados y administradores.</p>
      </div>
      <button
        class="px-4 py-2 text-sm font-bold text-acento-1 border border-acento-1 hover:bg-acento-1 hover:text-bg-hard rounded transition-colors"
        @click="abrirNuevo"
      >
        + Nuevo empleado
      </button>
    </div>

    <div class="flex flex-wrap gap-3 mb-6">
      <PanelInput v-model="busqueda" placeholder="Buscar por nombre, correo o RUT..." class="w-72" />
      <PanelSelect v-model="rolFiltro">
        <option value="todos">Todos los roles</option>
        <option value="empleado">Empleado</option>
        <option value="admin">Admin</option>
      </PanelSelect>
      <PanelSelect v-model="activoFiltro">
        <option value="todos">Todos</option>
        <option value="true">Activos</option>
        <option value="false">Inactivos</option>
      </PanelSelect>
    </div>

    <div class="hidden md:block">
      <TablaEmpleados
        :empleados="empleados"
        :pending="pending"
        :sort-col="sortCol"
        :sort-dir="sortDir"
        :current-user-id="user?.id ?? null"
        @toggle-sort="toggleSort"
        @editar="editar"
        @reset-password="abrirReset"
        @eliminar="eliminar"
        @reactivar="reactivar"
      />
    </div>
    <div class="md:hidden">
      <CardsEmpleados
        :empleados="empleados"
        :pending="pending"
        :current-user-id="user?.id ?? null"
        @editar="editar"
        @reset-password="abrirReset"
        @eliminar="eliminar"
        @reactivar="reactivar"
      />
    </div>

    <FormEmpleado
      v-if="modalAbierto"
      :empleado="empleadoEditando"
      @close="cerrarModal"
      @saved="onSaved"
    />

    <ModalResetPassword
      v-if="empleadoReset"
      :empleado="empleadoReset"
      @close="cerrarReset"
      @saved="onResetSaved"
    />
  </div>
</template>
