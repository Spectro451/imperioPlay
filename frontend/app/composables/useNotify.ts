type Notify = { tipo: 'ok' | 'error'; texto: string } | null

let timer: ReturnType<typeof setTimeout> | null = null

export function useNotify() {
  const mensaje = useState<Notify>('panel.notify', () => null)

  function notificar(tipo: 'ok' | 'error', texto: string) {
    if (timer) clearTimeout(timer)
    mensaje.value = { tipo, texto }
    timer = setTimeout(() => { mensaje.value = null }, 3500)
  }

  function limpiar() {
    if (timer) clearTimeout(timer)
    mensaje.value = null
  }

  return { mensaje, notificar, limpiar }
}
