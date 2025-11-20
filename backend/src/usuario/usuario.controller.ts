import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { Prisma, Usuario } from '@prisma/client';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  async create(@Body() data: Prisma.UsuarioCreateInput): Promise<Usuario> {
    return this.usuarioService.create(data);
  }

  @Get()
  async findAll(): Promise<Usuario[]> {
    return this.usuarioService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Usuario | null> {
    return this.usuarioService.findOne(Number(id));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Prisma.UsuarioUpdateInput,
  ): Promise<Usuario> {
    return this.usuarioService.update(Number(id), data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Usuario> {
    return this.usuarioService.remove(Number(id));
  }
}
