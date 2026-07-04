import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { tipoProducto } from 'src/entities/enums';

export class CreateProductoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsEnum(tipoProducto)
  tipo: tipoProducto;

  @IsOptional()
  @IsString()
  sku?: string;
}
