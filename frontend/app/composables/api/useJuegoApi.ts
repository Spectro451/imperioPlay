export function useJuegoApi() {
  const api = useApi()

  async function getOne(id: number) {
    return api<any>(`/juego/${id}`)
  }

  return { getOne }
}
