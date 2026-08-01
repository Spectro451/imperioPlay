import { IsEmail, IsString, MinLength } from 'class-validator';

export class RestoreUsuarioDto {
  @IsEmail()
  correo: string;

  @IsString()
  @MinLength(8)
  password: string;
}
