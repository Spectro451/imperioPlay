import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { UsuarioService } from './usuario.service';
import { Usuario } from '../entities/usuario.entity';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RestoreUsuarioDto } from './dto/restore-usuario.dto';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Get('yo')
  @UseGuards(JwtAuthGuard)
  async getPerfil(@Request() req) {
    return this.usuarioService.findOne(req.user.id);
  }

  @Throttle({ default: { limit: 5, ttl: 60_000 } })
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
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<Usuario | null> {
    const requester = req.user;
    if (requester.rol !== 'admin' && requester.id !== id) {
      throw new ForbiddenException('No tienes permisos para ver este usuario');
    }
    return this.usuarioService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() data: UpdateUsuarioDto,
  ): Promise<Usuario> {
    const requester = req.user;
    if (requester.rol !== 'admin' && requester.id !== id) {
      throw new ForbiddenException(
        'No tienes permisos para editar este usuario',
      );
    }
    return this.usuarioService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<Usuario> {
    const requester = req.user;
    if (requester.rol !== 'admin' && requester.id !== id) {
      throw new ForbiddenException(
        'No tienes permisos para borrar este usuario',
      );
    }
    return this.usuarioService.remove(id);
  }

  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Patch(':id/password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() body: ChangePasswordDto,
  ) {
    const currentUser = req.user;
    if (currentUser.rol !== 'admin' && currentUser.id !== id) {
      throw new ForbiddenException(
        'No tienes permisos para cambiar esta contraseña',
      );
    }
    return this.usuarioService.changePassword(
      id,
      body.currentPassword,
      body.newPassword,
    );
  }

  @Patch(':id/password-reset')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async resetPassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ResetPasswordDto,
  ): Promise<Usuario> {
    return this.usuarioService.resetPassword(id, body.newPassword);
  }

  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Patch('restore')
  async restore(@Body() body: RestoreUsuarioDto): Promise<Usuario> {
    return this.usuarioService.restore(body.correo, body.password);
  }

  @Patch(':id/reactivar')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async reactivar(@Param('id', ParseIntPipe) id: number): Promise<Usuario> {
    return this.usuarioService.reactivar(id);
  }
}
