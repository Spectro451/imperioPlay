import { IsDateString, IsEnum, IsIn, IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { metodoPago } from 'src/entities/enums';

export type OrdenIntercambios =
  | 'fecha-asc'
  | 'fecha-desc'
  | 'dinero-asc'
  | 'dinero-desc';

export class FiltroIntercambiosDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsDateString()
  desde?: string;

  @IsOptional()
  @IsDateString()
  hasta?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  vendedor_id?: number;

  @IsOptional()
  @IsEnum(metodoPago)
  metodo_pago?: metodoPago;

  @IsOptional()
  @IsIn(['fecha-asc', 'fecha-desc', 'dinero-asc', 'dinero-desc'])
  orden?: OrdenIntercambios;
}
