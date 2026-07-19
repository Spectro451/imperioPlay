import { IsInt, Min } from 'class-validator';

export class CreateTierConfigDto {
  @IsInt()
  @Min(1)
  tier: number;

  @IsInt()
  @Min(1)
  valor: number;
}
