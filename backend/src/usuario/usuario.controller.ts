import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { Usuario } from '../entities/usuario.entity';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Rol } from '../entities/enums';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  async create(
    @Body()
    data: {
      nombre: string;
      correo: string;
      password: string;
      rol?: Rol;
    },
  ): Promise<Usuario> {
    return this.usuarioService.create(data);
  }

  @Get()
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findAll(): Promise<Usuario[]> {
    return this.usuarioService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(
    @Param('id') id: string,
    @Request() req,
  ): Promise<Usuario | null> {
    const userId = Number(id);
    const requester = req.user;
    if (requester.rol === 'admin') {
      return this.usuarioService.findOne(Number(id));
    }

    if (requester.id !== userId) {
      throw new ForbiddenException('No tienes permisos para ver este usuario');
    }

    return this.usuarioService.findOne(userId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() data: Partial<Usuario>,
  ): Promise<Usuario> {
    const userId = Number(id);
    const requester = req.user;

    if (requester.rol !== 'admin' && requester.id !== userId) {
      throw new ForbiddenException(
        'No tienes permisos para editar este usuario',
      );
    }
    if (requester.rol !== 'admin' && data.rol === 'admin') {
      delete data.rol;
    }
    return this.usuarioService.update(userId, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Request() req): Promise<Usuario> {
    const userId = Number(id);
    const requester = req.user;

    if (requester.rol !== 'admin' && requester.id !== userId) {
      throw new ForbiddenException(
        'No tienes permisos para inactivar este usuario',
      );
    }
    return this.usuarioService.remove(userId);
  }

  @Patch(':id/password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Param('id') id: string,
    @Request() req,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    const userId = Number(id);
    const currentUser = req.user;

    if (currentUser.rol !== 'admin' && currentUser.id !== userId) {
      throw new ForbiddenException(
        'No tienes permisos para cambiar esta contraseña',
      );
    }

    return this.usuarioService.changePassword(
      userId,
      body.currentPassword,
      body.newPassword,
    );
  }
  @Patch('restore')
  async restore(
    @Body() body: { correo: string; password: string },
  ): Promise<Usuario> {
    const { correo, password } = body;
    return this.usuarioService.restore(correo, password);
  }
}
