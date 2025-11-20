import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { IntercambioJuegoService } from './intercambio-juego.service';
import { Prisma, intercambioJuego } from '@prisma/client';

@Controller('intercambioJuego')
export class IntercambioJuegoController {
  constructor(
    private readonly intercambioJuegoService: IntercambioJuegoService,
  ) {}

  @Post()
  async create(
    @Body() data: Prisma.intercambioJuegoCreateInput,
  ): Promise<intercambioJuego> {
    return this.intercambioJuegoService.create(data);
  }

  @Get()
  async findAll(): Promise<intercambioJuego[]> {
    return this.intercambioJuegoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<intercambioJuego | null> {
    return this.intercambioJuegoService.findOne(Number(id));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Prisma.intercambioJuegoUpdateInput,
  ): Promise<intercambioJuego> {
    return this.intercambioJuegoService.update(Number(id), data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<intercambioJuego> {
    return this.intercambioJuegoService.remove(Number(id));
  }
}
