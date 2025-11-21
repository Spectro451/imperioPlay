import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { VentaService } from './venta.service';
import { Venta } from '../entities/venta.entity';

@Controller('venta')
export class VentaController {
  constructor(private readonly ventaService: VentaService) {}

  @Post()
  async create(@Body() data: Partial<Venta>): Promise<Venta> {
    return this.ventaService.create(data);
  }

  @Get()
  async findAll(): Promise<Venta[]> {
    return this.ventaService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Venta | null> {
    return this.ventaService.findOne(Number(id));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<Venta>,
  ): Promise<Venta> {
    return this.ventaService.update(Number(id), data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.ventaService.remove(Number(id));
  }
}
