import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { JuegoService } from './juego.service';
import { Juego } from '../entities/juego.entity';

@Controller('juego')
export class JuegoController {
  constructor(private readonly juegoService: JuegoService) {}

  @Post()
  async create(@Body() data: Partial<Juego>): Promise<Juego> {
    return this.juegoService.create(data);
  }

  @Get()
  async findAll(): Promise<Juego[]> {
    return this.juegoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Juego | null> {
    return this.juegoService.findOne(Number(id));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<Juego>,
  ): Promise<Juego> {
    return this.juegoService.update(Number(id), data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.juegoService.remove(Number(id));
  }
}
