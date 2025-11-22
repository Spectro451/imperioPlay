import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductoService } from './producto.service';
import { Producto } from '../entities/producto.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { tipoProducto } from 'src/entities/enums';

@Controller('producto')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'empleado')
  async create(@Body() data: Partial<Producto>): Promise<Producto> {
    return this.productoService.create(data);
  }

  @Get()
  findAll(
    @Query() query: { nombre?: string; tipo?: tipoProducto; page?: string },
  ) {
    return this.productoService.findAll({
      nombre: query.nombre,
      tipo: query.tipo as tipoProducto,
      page: query.page ? parseInt(query.page) : undefined,
    });
  }

  @Get('/ofertas')
  findOfertas(
    @Query() query: { nombre?: string; tipo?: tipoProducto; page?: string },
  ) {
    return this.productoService.findOfertas({
      nombre: query.nombre,
      tipo: query.tipo as tipoProducto,
      page: query.page ? parseInt(query.page) : undefined,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Producto | null> {
    return this.productoService.findOne(Number(id));
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'empleado')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<Producto>,
  ): Promise<Producto> {
    return this.productoService.update(Number(id), data);
  }

  @Patch(':id/oferta')
  async changeOferta(
    @Param('id') id: string,
    @Body()
    descuentos: { descuento_porcetaje?: number; descuento_fijo?: number },
  ): Promise<Producto> {
    try {
      return await this.productoService.modificarOferta(Number(id), descuentos);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'empleado')
  async remove(@Param('id') id: string) {
    try {
      await this.productoService.remove(Number(id));
      return { message: `Producto con id: ${id} eliminado correctamente` };
    } catch (err) {
      throw new NotFoundException(err.message);
    }
  }
}
