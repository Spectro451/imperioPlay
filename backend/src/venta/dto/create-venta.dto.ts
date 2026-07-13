import {
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { metodoPago, tipoProducto } from 'src/entities/enums';

class VentaItemDto {
  @IsInt()
  @Min(1)
  id: number;

  @IsEnum(tipoProducto)
  tipo: tipoProducto;

  @IsInt()
  @Min(1)
  cantidad: number;
}

export class CreateVentaDto {
  @IsOptional()
  @IsInt()
  cliente_id?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  descuento_porcentaje?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  descuento_fijo?: number;

  @IsEnum(metodoPago)
  metodo_pago: metodoPago;

  @IsNumber()
  @Min(0)
  monto_pagado: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VentaItemDto)
  items: VentaItemDto[];
}
