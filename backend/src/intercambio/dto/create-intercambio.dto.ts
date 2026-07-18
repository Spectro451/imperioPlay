import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Plataforma, estadoJuego, metodoPago, tipoProducto } from 'src/entities/enums';

class JuegoSolicitadoDto {
  @IsInt()
  @Min(1)
  juegoId: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  cantidad?: number;
}

class ProductoIntercambioDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsEnum(tipoProducto)
  tipo: tipoProducto;

  @IsString()
  @IsNotEmpty()
  sku: string;
}

class JuegoClienteDto {
  @ValidateNested()
  @Type(() => ProductoIntercambioDto)
  producto: ProductoIntercambioDto;

  @IsEnum(Plataforma)
  consola: Plataforma;

  @IsOptional()
  @IsEnum(estadoJuego)
  estado?: estadoJuego;

  @IsInt()
  @Min(1)
  cantidad: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fotos?: string[];

  @IsNumber()
  @Min(0)
  precio_base: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  descuento_porcentaje?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  descuento_fijo?: number;
}

export class CreateIntercambioDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => JuegoSolicitadoDto)
  juegosSolicitadosData: JuegoSolicitadoDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => JuegoClienteDto)
  juegosClienteData: JuegoClienteDto[];

  @IsOptional()
  @IsInt()
  vendedor_id?: number;

  @IsOptional()
  @IsInt()
  clienteId?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  monto_pagado?: number;

  @IsOptional()
  @IsEnum(metodoPago)
  metodo_pago?: metodoPago;
}
