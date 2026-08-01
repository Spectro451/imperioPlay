export function useAuthApi() {
  const api = useApi()

  return {
    login: (correo: string, password: string) =>
      api<{ rol: string; correo: string }>('/auth/login', {
        method: 'POST',
        body: { correo, password },
      }),
    registro: (nombre: string, correo: string, password: string) =>
      api<{ id: number; correo: string; rol: string }>('/usuario', {
        method: 'POST',
        body: { nombre, correo, password },
      }),
  }
}
