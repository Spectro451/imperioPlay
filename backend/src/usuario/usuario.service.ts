import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Rol, Usuario } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    nombre: string;
    correo: string;
    password: string;
    rol?: Rol;
  }): Promise<Usuario> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.usuario.create({
      data: {
        nombre: data.nombre,
        correo: data.correo,
        password: hashedPassword,
        rol: data.rol ?? Rol.cliente,
      },
    });
  }

  async findAll(): Promise<Usuario[]> {
    return this.prisma.usuario.findMany();
  }

  async findOne(id: number): Promise<Usuario | null> {
    return this.prisma.usuario.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: Prisma.UsuarioUpdateInput): Promise<Usuario> {
    return this.prisma.usuario.update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<Usuario> {
    return this.prisma.usuario.delete({
      where: { id },
    });
  }

  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
  ): Promise<Usuario> {
    const user = await this.prisma.usuario.findUnique({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const passwordIguales = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!passwordIguales)
      throw new BadRequestException('Las contraseñas no son iguales');

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    return this.prisma.usuario.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }
}
