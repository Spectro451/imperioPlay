import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { VentaJuegoService } from './venta-juego.service';
import { VentaJuego } from '../entities/ventaJuego.entity';

@Controller('venta-juego')
export class VentaJuegoController {
  constructor(private readonly ventaJuegoService: VentaJuegoService) {}

  @Post()
  async create(@Body() data: Partial<VentaJuego>): Promise<VentaJuego> {
    return this.ventaJuegoService.create(data);
  }

  @Get()
  async findAll(): Promise<VentaJuego[]> {
    return this.ventaJuegoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<VentaJuego | null> {
    return this.ventaJuegoService.findOne(Number(id));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<VentaJuego>,
  ): Promise<VentaJuego> {
    return this.ventaJuegoService.update(Number(id), data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.ventaJuegoService.remove(Number(id));
  }
}
