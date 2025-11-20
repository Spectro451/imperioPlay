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
import { Prisma, VentaJuego } from '@prisma/client';

@Controller('ventaJuego')
export class VentaJuegoController {
  constructor(private readonly ventaJuegoService: VentaJuegoService) {}

  @Post()
  async create(
    @Body() data: Prisma.VentaJuegoCreateInput,
  ): Promise<VentaJuego> {
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
    @Body() data: Prisma.VentaJuegoUpdateInput,
  ): Promise<VentaJuego> {
    return this.ventaJuegoService.update(Number(id), data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<VentaJuego> {
    return this.ventaJuegoService.remove(Number(id));
  }
}
