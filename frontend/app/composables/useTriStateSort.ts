import type { Ref } from 'vue'

export type SortDir = 'asc' | 'desc'

export function useTriStateSort<C extends string>(config: {
  defaultCol: C
  defaultDir?: SortDir
  ascCols?: readonly C[]
}) {
  const defaultDir: SortDir = config.defaultDir ?? 'desc'
  const sortCol = ref<C>(config.defaultCol) as Ref<C>
  const sortDir = ref<SortDir>(defaultDir)

  function dirInicial(col: C): SortDir {
    return config.ascCols?.includes(col) ? 'asc' : 'desc'
  }

  function toggleSort(col: C) {
    if (sortCol.value !== col) {
      sortCol.value = col
      sortDir.value = dirInicial(col)
      return
    }
    if (sortDir.value === dirInicial(col)) {
      sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortCol.value = config.defaultCol
      sortDir.value = defaultDir
    }
  }

  return { sortCol, sortDir, toggleSort }
}
