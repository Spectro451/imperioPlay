import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import type { Request } from 'express';
import { UsuarioService } from '../usuario/usuario.service';

function extractTokenFromCookie(req: Request): string | null {
  const raw = req.headers.cookie;
  if (!raw) return null;
  const match = raw.match(/(?:^|;\s*)token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usuarioService: UsuarioService) {
    super({
      jwtFromRequest: extractTokenFromCookie,
      secretOrKey: process.env.SECRET as string,
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    const usuario = await this.usuarioService.findActivo(payload.sub);
    if (!usuario) throw new UnauthorizedException('Sesión inválida');
    return usuario;
  }
}
