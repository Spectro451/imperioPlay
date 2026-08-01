import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { IsRut } from 'src/utils/rut';

export class UpdateUsuarioDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  nombre?: string;

  @IsOptional()
  @IsEmail()
  correo?: string;

  @IsOptional()
  @IsRut()
  rut?: string;
}
