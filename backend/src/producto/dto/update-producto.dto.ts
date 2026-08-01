import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { tipoProducto } from 'src/entities/enums';

export class UpdateProductoDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  nombre?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  sku?: string;

  @IsOptional()
  @IsEnum(tipoProducto)
  tipo?: tipoProducto;
}
