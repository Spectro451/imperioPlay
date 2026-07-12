export function useAuthApi() {
  const api = useApi()

  return {
    login: (correo: string, password: string) =>
      api<{ rol: string; correo: string }>('/auth/login', {
        method: 'POST',
        body: { correo, password },
      }),
  }
}
