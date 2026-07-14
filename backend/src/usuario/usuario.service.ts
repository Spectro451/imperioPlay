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
import { normalizarRut } from 'src/utils/rut';

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
  }): Promise<Usuario> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const usuario = this.usuarioRepo.create({
      nombre: data.nombre,
      correo: data.correo,
      password: hashedPassword,
      rol: Rol.cliente,
    });
    return this.usuarioRepo.save(usuario);
  }

  async createEmpleado(data: {
    nombre: string;
    correo: string;
    password: string;
    rut: string;
  }): Promise<Usuario> {
    const rutNormalizado = normalizarRut(data.rut);

    const existente = await this.usuarioRepo.findOne({
      where: { rut: rutNormalizado },
    });
    if (existente) {
      throw new BadRequestException('Ya existe un usuario con ese RUT');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const usuario = this.usuarioRepo.create({
      nombre: data.nombre,
      correo: data.correo,
      password: hashedPassword,
      rol: Rol.empleado,
      rut: rutNormalizado,
    });
    return this.usuarioRepo.save(usuario);
  }

  async findByRut(rut: string): Promise<Usuario> {
    const rutNormalizado = normalizarRut(rut);
    const usuario = await this.usuarioRepo.findOne({
      where: { rut: rutNormalizado, isActive: true },
    });
    if (!usuario) {
      throw new NotFoundException('No existe un usuario activo con ese RUT');
    }
    if (usuario.rol === Rol.cliente) {
      throw new NotFoundException('El RUT no corresponde a un vendedor');
    }
    return usuario;
  }

  async findEmpleados(): Promise<Usuario[]> {
    return this.usuarioRepo.find({
      where: [{ rol: Rol.empleado }, { rol: Rol.admin }],
      order: { id: 'DESC' },
    });
  }

  async validarVendedor(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepo.findOne({
      where: { id, isActive: true },
    });
    if (!usuario) {
      throw new BadRequestException('Vendedor no encontrado o inactivo');
    }
    if (usuario.rol === Rol.cliente) {
      throw new BadRequestException(
        'El usuario indicado no puede registrar ventas',
      );
    }
    return usuario;
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

  async reactivar(id: number): Promise<Usuario> {
    const user = await this.findOne(id);
    if (!user)
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    if (user.isActive)
      throw new BadRequestException('El usuario ya está activo');
    user.isActive = true;
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
