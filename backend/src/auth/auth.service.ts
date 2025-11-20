import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(correo: string, password: string) {
    const user = await this.prisma.usuario.findUnique({
      where: { correo },
    });

    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch ? user : null;
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
