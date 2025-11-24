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
  UseGuards,
} from '@nestjs/common';
import { JuegoService } from './juego.service';
import { Juego } from '../entities/juego.entity';
import { ProductoService } from 'src/producto/producto.service';
import { Producto } from 'src/entities/producto.entity';
import { Consola, estadoJuego } from 'src/entities/enums';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('juego')
export class JuegoController {
  constructor(
    private readonly juegoService: JuegoService,
    private readonly productoService: ProductoService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'empleado')
  async create(
    @Body()
    data: {
      producto: Partial<Producto>;
      juego: {
        consola: Consola;
        estado: estadoJuego;
        stock?: number;
        fotos?: string[];
        precio_base: number;
        descuento_porcentaje?: number;
        descuento_fijo?: number;
      };
    },
  ) {
    const producto = await this.productoService.crearProductoSiNoExiste(
      data.producto,
    );
    const juego = await this.juegoService.crearJuegoSiNoExiste(
      producto,
      data.juego,
    );

    return {
      producto: {
        id: producto.id,
        nombre: producto.nombre,
        tipo: producto.tipo,
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
      },
    };
  }

  @Get()
  async findAll(): Promise<Juego[]> {
    return this.juegoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Juego | null> {
    return this.juegoService.findOne(Number(id));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<Juego>,
  ): Promise<Juego> {
    return this.juegoService.update(Number(id), data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.juegoService.remove(Number(id));
  }

  @Patch(':id/oferta')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'empleado')
  async changeOferta(
    @Param('id') id: string,
    @Body()
    descuentos: { descuento_porcentaje?: number; descuento_fijo?: number },
  ): Promise<Juego> {
    try {
      return await this.juegoService.modificarOferta(Number(id), descuentos);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
