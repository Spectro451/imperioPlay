import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProductoService } from './producto.service';
import { Producto } from '../entities/producto.entity';

@Controller('producto')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Post()
  async create(@Body() data: Partial<Producto>): Promise<Producto> {
    return this.productoService.create(data);
  }

  @Get()
  async findAll(): Promise<Producto[]> {
    return this.productoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Producto | null> {
    return this.productoService.findOne(Number(id));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<Producto>,
  ): Promise<Producto> {
    return this.productoService.update(Number(id), data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.productoService.remove(Number(id));
  }
}
