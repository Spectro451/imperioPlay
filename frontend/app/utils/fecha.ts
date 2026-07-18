export function formatearFecha(fecha: string): string {
  const d = new Date(fecha)
  return d.toLocaleString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/Santiago',
  })
}

export function inicioDelDiaLocal(fecha: string): string | undefined {
  if (!fecha) return undefined
  return new Date(`${fecha}T00:00:00`).toISOString()
}

export function finDelDiaLocal(fecha: string): string | undefined {
  if (!fecha) return undefined
  return new Date(`${fecha}T23:59:59.999`).toISOString()
}

export function inputALocal(iso?: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}
