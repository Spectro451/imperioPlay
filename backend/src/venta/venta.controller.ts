import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { VentaService } from './venta.service';
import { Venta } from '../entities/venta.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { metodoPago, tipoProducto } from 'src/entities/enums';

@Controller('venta')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VentaController {
  constructor(private readonly ventaService: VentaService) {}

  @Post()
  @Roles('admin', 'empleado')
  async create(
    @Body()
    data: {
      cliente_id?: number;
      descuento_porcentaje?: number;
      descuento_fijo?: number;
      metodo_pago: metodoPago;
      monto_pagado: number;
      items: {
        id: number;
        tipo: tipoProducto;
        cantidad: number;
      }[];
    },
    @Req() req: any,
  ): Promise<Venta> {
    const vendedor_id = req.user.id;

    return this.ventaService.create(vendedor_id, data);
  }

  @Get()
  @Roles('admin', 'empleado')
  async findAll(): Promise<Venta[]> {
    return this.ventaService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'empleado')
  async findOne(@Param('id') id: string): Promise<Venta | null> {
    return this.ventaService.findOne(Number(id));
  }

  @Put(':id')
  @Roles('admin')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<Venta>,
  ): Promise<Venta> {
    return this.ventaService.update(Number(id), data);
  }

  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id') id: string): Promise<{ mensaje: string }> {
    return this.ventaService.remove(Number(id));
  }
}
