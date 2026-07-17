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
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RestoreUsuarioDto } from './dto/restore-usuario.dto';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Get('yo')
  @UseGuards(JwtAuthGuard)
  async getPerfil(@Request() req) {
    const userId = parseInt(req.user.id);
    return this.usuarioService.findOne(userId);
  }

  @Post()
  async create(@Body() data: CreateUsuarioDto): Promise<Usuario> {
    return this.usuarioService.create(data);
  }

  @Post('empleado')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createEmpleado(@Body() data: CreateEmpleadoDto): Promise<Usuario> {
    return this.usuarioService.createEmpleado(data);
  }

  @Get()
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findAll(): Promise<Usuario[]> {
    return this.usuarioService.findAll();
  }

  @Get('empleados')
  @Roles('admin', 'empleado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findEmpleados(): Promise<Usuario[]> {
    return this.usuarioService.findEmpleados();
  }

  @Get('rut/:rut')
  @Roles('admin', 'empleado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findByRut(@Param('rut') rut: string): Promise<Usuario> {
    return this.usuarioService.findByRut(rut);
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
        'No tienes permisos para borrar este usuario',
      );
    }
    return this.usuarioService.remove(userId);
  }

  @Patch(':id/password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Param('id') id: string,
    @Request() req,
    @Body() body: ChangePasswordDto,
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

  @Patch(':id/password-reset')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async resetPassword(
    @Param('id') id: string,
    @Body() body: ResetPasswordDto,
  ): Promise<Usuario> {
    return this.usuarioService.resetPassword(Number(id), body.newPassword);
  }

  @Patch('restore')
  async restore(@Body() body: RestoreUsuarioDto): Promise<Usuario> {
    return this.usuarioService.restore(body.correo, body.password);
  }

  @Patch(':id/reactivar')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async reactivar(@Param('id') id: string): Promise<Usuario> {
    return this.usuarioService.reactivar(Number(id));
  }
}
