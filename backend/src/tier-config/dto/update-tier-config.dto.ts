import { IsInt, Min } from 'class-validator';

export class UpdateTierConfigDto {
  @IsInt()
  @Min(1)
  valor: number;
}
