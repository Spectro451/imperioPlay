import { BadRequestException } from '@nestjs/common';
import { VALOR_TIER } from 'src/constants/tiers.constant';

export function calcularPrecioFinal(
  precio_base: number,
  descuento_porcentaje?: number,
  descuento_fijo?: number,
): number {
  descuento_porcentaje =
    descuento_porcentaje === 0 ? undefined : descuento_porcentaje;
  descuento_fijo = descuento_fijo === 0 ? undefined : descuento_fijo;

  if (descuento_porcentaje && descuento_fijo) {
    throw new BadRequestException('Solo puede haber un descuento a la vez');
  }

  if (descuento_porcentaje) {
    if (descuento_porcentaje > 100) {
      throw new BadRequestException(
        'El descuento porcentual no puede ser mayor al 100%',
      );
    }
    return Math.round(precio_base * (1 - descuento_porcentaje / 100));
  }

  if (descuento_fijo) {
    if (descuento_fijo > precio_base) {
      throw new BadRequestException(
        'El descuento fijo no puede ser mayor al precio base',
      );
    }
    return precio_base - descuento_fijo;
  }

  return precio_base;
}

export function calcularTier(precioFinal: number): number {
  const tiers = Object.entries(VALOR_TIER)
    .map(([tier, valor]) => ({ tier: Number(tier), valor }))
    .sort((a, b) => a.valor - b.valor);

  for (const t of tiers) {
    if (precioFinal <= t.valor) return t.tier;
  }

  return tiers[tiers.length - 1].tier;
}
