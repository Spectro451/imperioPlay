import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JuegoService } from './juego.service';
import { Juego } from '../entities/juego.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Plataforma, estadoJuego, Orden } from 'src/entities/enums';
import { CreateJuegoDto } from './dto/create-juego.dto';
import { UpdateJuegoDto } from './dto/update-juego.dto';
import { OfertaDto } from './dto/oferta.dto';

@Controller('juego')
export class JuegoController {
  constructor(private readonly juegoService: JuegoService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'empleado')
  async create(@Body() data: CreateJuegoDto) {
    const { producto, juego } = await this.juegoService.upsertConProducto(
      data.producto,
      data.juego,
    );

    const advertencias: string[] = [];
    if (!producto.isActive)
      advertencias.push(
        `El producto "${producto.nombre}" está desactivado y no será visible en el catálogo hasta que lo reactives.`,
      );
    if (!juego.isActive)
      advertencias.push(
        `El juego (${juego.consola} / ${juego.estado}) está desactivado y no será visible hasta que lo reactives.`,
      );

    return {
      producto: {
        id: producto.id,
        nombre: producto.nombre,
        tipo: producto.tipo,
        sku: producto.sku,
        isActive: producto.isActive,
      },
      juego: {
        id: juego.id,
        productoId: juego.productoId,
        stock: juego.stock,
        consola: juego.consola,
        estado: juego.estado,
        precio_base: juego.precio_base,
        precio_final: juego.precio_final,
        descuento_porcentaje: juego.descuento_porcentaje,
        descuento_fijo: juego.descuento_fijo,
        tier: juego.tier,
        fotos: juego.fotos,
        isActive: juego.isActive,
      },
      ...(advertencias.length > 0 && { advertencias }),
    };
  }

  @Get()
  async findAll(@Query() query: {
    nombre?: string;
    consola?: string;
    estado?: string;
    orden?: string;
    page?: string;
    limit?: string;
    activo?: string;
  }) {
    const activo = query.activo === 'false' || query.activo === 'todos'
      ? query.activo
      : 'true';
    return this.juegoService.findAll({
      nombre: query.nombre,
      consola: query.consola as Plataforma,
      estado: query.estado as estadoJuego,
      orden: query.orden as Orden,
      page: query.page ? parseInt(query.page) : undefined,
      limit: query.limit ? parseInt(query.limit) : undefined,
      activo: activo as 'true' | 'false' | 'todos',
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Juego | null> {
    return this.juegoService.findOne(Number(id));
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'empleado')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateJuegoDto,
  ): Promise<Juego> {
    return this.juegoService.update(Number(id), data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async remove(@Param('id') id: string): Promise<void> {
    return this.juegoService.remove(Number(id));
  }

  @Patch(':id/oferta')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'empleado')
  async changeOferta(
    @Param('id') id: string,
    @Body() descuentos: OfertaDto,
  ): Promise<Juego> {
    try {
      return await this.juegoService.modificarOferta(Number(id), descuentos);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Patch(':id/restore')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'empleado')
  async restore(@Param('id') id: string): Promise<Juego> {
    return this.juegoService.restore(Number(id));
  }
}
