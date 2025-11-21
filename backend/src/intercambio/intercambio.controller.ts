import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { IntercambioService } from './intercambio.service';
import { Intercambio } from '../entities/intercambio.entity';

@Controller('intercambio')
export class IntercambioController {
  constructor(private readonly intercambioService: IntercambioService) {}

  @Post()
  async create(@Body() data: Partial<Intercambio>): Promise<Intercambio> {
    return this.intercambioService.create(data);
  }

  @Get()
  async findAll(): Promise<Intercambio[]> {
    return this.intercambioService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Intercambio | null> {
    return this.intercambioService.findOne(Number(id));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<Intercambio>,
  ): Promise<Intercambio> {
    return this.intercambioService.update(Number(id), data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.intercambioService.remove(Number(id));
  }
}
