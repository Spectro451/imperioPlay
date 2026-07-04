import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Plataforma, estadoJuego, tipoProducto } from 'src/entities/enums';

class ProductoConsolaDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsEnum(tipoProducto)
  tipo: tipoProducto;

  @IsOptional()
  @IsString()
  sku?: string;
}

class ConsolaDataDto {
  @IsOptional()
  @IsEnum(estadoJuego)
  estado?: estadoJuego;

  @IsOptional()
  @IsEnum(Plataforma)
  generacion?: Plataforma;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

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

export class CreateConsolaDto {
  @ValidateNested()
  @Type(() => ProductoConsolaDto)
  producto: ProductoConsolaDto;

  @ValidateNested()
  @Type(() => ConsolaDataDto)
  consola: ConsolaDataDto;
}
