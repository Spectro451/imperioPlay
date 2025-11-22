import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { VentaProductoService } from './ventaProducto.service';
import { VentaProducto } from '../entities/ventaProducto';

@Controller('ventaproducto')
export class VentaProductoController {
  constructor(private readonly ventaProductoService: VentaProductoService) {}

  @Post()
  async create(@Body() data: Partial<VentaProducto>): Promise<VentaProducto> {
    return this.ventaProductoService.create(data);
  }

  @Get()
  async findAll(): Promise<VentaProducto[]> {
    return this.ventaProductoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<VentaProducto | null> {
    return this.ventaProductoService.findOne(Number(id));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<VentaProducto>,
  ): Promise<VentaProducto> {
    return this.ventaProductoService.update(Number(id), data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.ventaProductoService.remove(Number(id));
  }
}
