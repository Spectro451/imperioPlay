import { Orden } from 'src/entities/enums';

export const ORDER_MAP = {
  [Orden.ID]: ['producto.id', 'ASC'] as const,
  [Orden.ID_DESC]: ['producto.id', 'DESC'] as const,
  [Orden.ABC]: ['producto.nombre', 'ASC'] as const,
  [Orden.ABC_DESC]: ['producto.nombre', 'DESC'] as const,
} as const;
