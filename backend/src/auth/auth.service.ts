import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(correo: string, password: string) {
    const user = await this.usuarioRepo.findOne({ where: { correo } });
    if (!user)
      throw new UnauthorizedException('Usuario o contraseña incorrectos');

    if (!user.isActive)
      throw new UnauthorizedException('Usuario inactivo, recupere su cuenta');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      throw new UnauthorizedException('Usuario o contraseña incorrectos');

    return user;
  }

  async login(user: any) {
    const payload = { sub: user.id, correo: user.correo, rol: user.rol };
    return {
      access_token: this.jwtService.sign(payload),
      rol: user.rol,
      correo: user.correo,
    };
  }
}
