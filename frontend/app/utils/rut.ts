const RUT_REGEX = /^\d{7,8}-[\dkK]$/

export function normalizarRut(rut: string): string {
  return rut.trim().replace(/\./g, '').toLowerCase()
}

export function esRutValido(rut: string): boolean {
  if (typeof rut !== 'string') return false
  const normalizado = normalizarRut(rut)
  if (!RUT_REGEX.test(normalizado)) return false

  const [cuerpo, dv] = normalizado.split('-')
  let suma = 0
  let multiplicador = 2

  for (let i = cuerpo!.length - 1; i >= 0; i--) {
    suma += Number(cuerpo![i]) * multiplicador
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1
  }

  const resto = 11 - (suma % 11)
  const dvEsperado = resto === 11 ? '0' : resto === 10 ? 'k' : String(resto)

  return dv === dvEsperado
}
