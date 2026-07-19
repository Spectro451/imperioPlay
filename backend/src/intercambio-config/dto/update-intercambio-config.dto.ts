import { IsInt, IsOptional, Min } from 'class-validator';

export class UpdateIntercambioConfigDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  recargo_base?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  recargo_por_tier?: number;
}
