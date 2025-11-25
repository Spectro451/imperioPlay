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
import { IntercambioJuegoService } from './intercambio-juego.service';
import { IntercambioJuego } from '../entities/intercambioJuego.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('intercambio-juego')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class IntercambioJuegoController {
  constructor(
    private readonly intercambioJuegoService: IntercambioJuegoService,
  ) {}

  @Post()
  async create(
    @Body() data: Partial<IntercambioJuego>,
  ): Promise<IntercambioJuego> {
    return this.intercambioJuegoService.create(data);
  }

  @Get()
  async findAll(): Promise<IntercambioJuego[]> {
    return this.intercambioJuegoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<IntercambioJuego | null> {
    return this.intercambioJuegoService.findOne(Number(id));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<IntercambioJuego>,
  ): Promise<IntercambioJuego> {
    return this.intercambioJuegoService.update(Number(id), data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.intercambioJuegoService.remove(Number(id));
  }
}
