import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Plataforma, estadoJuego } from 'src/entities/enums';

export class UpdateJuegoDto {
  @IsOptional()
  @IsEnum(Plataforma)
  consola?: Plataforma;

  @IsOptional()
  @IsEnum(estadoJuego)
  estado?: estadoJuego;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fotos?: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  precio_base?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  descuento_porcentaje?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  descuento_fijo?: number;
}
