import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { IsRut } from 'src/utils/rut';

export class CreateEmpleadoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsEmail()
  correo: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsRut()
  rut: string;
}
