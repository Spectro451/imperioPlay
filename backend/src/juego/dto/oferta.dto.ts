import { IsNumber, IsOptional, Min } from 'class-validator';

export class OfertaDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  descuento_porcentaje?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  descuento_fijo?: number;
}
