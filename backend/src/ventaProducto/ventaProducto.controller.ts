import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { VentaDetalleService } from './ventaProducto.service';
import { VentaDetalle } from '../entities/ventaDetalle';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('ventaproducto')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class VentaProductoController {
  constructor(private readonly ventaProductoService: VentaDetalleService) {}

  @Post()
  async create(@Body() data: Partial<VentaDetalle>): Promise<VentaDetalle> {
    return this.ventaProductoService.create(data);
  }

  @Get()
  async findAll(): Promise<VentaDetalle[]> {
    return this.ventaProductoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<VentaDetalle | null> {
    return this.ventaProductoService.findOne(Number(id));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<VentaDetalle>,
  ): Promise<VentaDetalle> {
    return this.ventaProductoService.update(Number(id), data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.ventaProductoService.remove(Number(id));
  }
}
