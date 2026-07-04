import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() { correo, password }: LoginDto) {
    const user = await this.authService.validateUser(correo, password);
    if (!user) throw new UnauthorizedException('Credenciales invalidas');
    return this.authService.login(user);
  }
}
