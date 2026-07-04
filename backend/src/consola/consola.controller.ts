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
import { ConsolaService } from './consola.service';
import { ProductoService } from 'src/producto/producto.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Consola } from 'src/entities/consola';
import { CreateConsolaDto } from './dto/create-consola.dto';
import { UpdateConsolaDto } from './dto/update-consola.dto';
import { OfertaDto } from 'src/juego/dto/oferta.dto';

@Controller('consola')
export class ConsolaController {
  constructor(
    private readonly consolaService: ConsolaService,
    private readonly productoService: ProductoService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'empleado')
  async create(@Body() data: CreateConsolaDto) {
    const producto = await this.productoService.crearProductoSiNoExiste(
      data.producto,
    );
    const consola = await this.consolaService.crearConsolaSiNoExiste(
      producto,
      data.consola,
    );
    return {
      producto: {
        id: producto.id,
        nombre: producto.nombre,
        tipo: producto.tipo,
      },
      consola: {
        id: consola.id,
        productoId: consola.productoId,
        stock: consola.stock,
        estado: consola.estado,
        generacion: consola.generacion,
        precio_base: consola.precio_base,
        precio_final: consola.precio_final,
        descuento_porcentaje: consola.descuento_porcentaje,
        descuento_fijo: consola.descuento_fijo,
        fotos: consola.fotos,
      },
    };
  }

  @Get()
  async findAll(): Promise<Consola[]> {
    return this.consolaService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Consola | null> {
    return this.consolaService.findOne(Number(id));
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'empleado')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateConsolaDto,
  ): Promise<Consola> {
    return this.consolaService.update(Number(id), data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async remove(@Param('id') id: string): Promise<void> {
    return this.consolaService.remove(Number(id));
  }

  @Patch(':id/oferta')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'empleado')
  async changeOferta(
    @Param('id') id: string,
    @Body() descuentos: OfertaDto,
  ): Promise<Consola> {
    try {
      return await this.consolaService.modificarOferta(Number(id), descuentos);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
