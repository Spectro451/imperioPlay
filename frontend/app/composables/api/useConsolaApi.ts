export function useConsolaApi() {
  const api = useApi()

  async function getOne(id: number) {
    return api<any>(`/consola/${id}`)
  }

  return { getOne }
}
