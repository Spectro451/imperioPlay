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
import { VentaDetalleService } from './venta-detalle.service';
import { VentaDetalle } from '../entities/ventaDetalle';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('venta-detalle')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class VentaDetalleController {
  constructor(private readonly ventaDetalleService: VentaDetalleService) {}

  @Post()
  async create(@Body() data: Partial<VentaDetalle>): Promise<VentaDetalle> {
    return this.ventaDetalleService.create(data);
  }

  @Get()
  async findAll(): Promise<VentaDetalle[]> {
    return this.ventaDetalleService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<VentaDetalle | null> {
    return this.ventaDetalleService.findOne(Number(id));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<VentaDetalle>,
  ): Promise<VentaDetalle> {
    return this.ventaDetalleService.update(Number(id), data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.ventaDetalleService.remove(Number(id));
  }
}
