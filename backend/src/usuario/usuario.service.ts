import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../entities/usuario.entity';
import { Rol } from '../entities/enums';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  async create(data: {
    nombre: string;
    correo: string;
    password: string;
    rol?: Rol;
  }): Promise<Usuario> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const usuario = this.usuarioRepo.create({
      nombre: data.nombre,
      correo: data.correo,
      password: hashedPassword,
      rol: data.rol ?? Rol.cliente,
    });
    return this.usuarioRepo.save(usuario);
  }

  findAll(): Promise<Usuario[]> {
    return this.usuarioRepo.find({
      relations: [
        'intercambios',
        'intercambiosCliente',
        'compras',
        'ventasVendedor',
      ],
    });
  }

  findOne(id: number): Promise<Usuario | null> {
    return this.usuarioRepo.findOne({
      where: { id },
      relations: [
        'intercambios',
        'intercambiosCliente',
        'compras',
        'ventasVendedor',
      ],
    });
  }

  async update(id: number, data: Partial<Usuario>): Promise<Usuario> {
    const result = await this.usuarioRepo.update(id, data);
    if (result.affected === 0) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    return this.findOne(id) as Promise<Usuario>;
  }

  async remove(id: number): Promise<Usuario> {
    const user = await this.findOne(id);
    if (!user)
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    if (!user.isActive) throw new BadRequestException('Usuario ya inactivo');

    user.isActive = false;
    return this.usuarioRepo.save(user);
  }

  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
  ): Promise<Usuario> {
    const user = await this.findOne(userId);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const passwordIguales = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!passwordIguales)
      throw new BadRequestException('Las contraseñas no son iguales');

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    return this.update(userId, { password: hashedPassword });
  }

  async restore(correo: string, password: string): Promise<Usuario> {
    const user = await this.usuarioRepo.findOne({
      where: { correo },
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');
    if (user.isActive)
      throw new BadRequestException('La cuenta ya está activa');

    const passwordValida = await bcrypt.compare(password, user.password);
    if (!passwordValida)
      throw new BadRequestException('Credenciales incorrectas');

    user.isActive = true;

    return this.usuarioRepo.save(user);
  }
}
