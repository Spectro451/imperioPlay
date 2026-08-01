import { IsInt, IsOptional, ValidateIf } from 'class-validator';

export class AddWishlistItemDto {
  @ValidateIf((o) => !o.consolaId)
  @IsInt()
  @IsOptional()
  juegoId?: number;

  @ValidateIf((o) => !o.juegoId)
  @IsInt()
  @IsOptional()
  consolaId?: number;
}
