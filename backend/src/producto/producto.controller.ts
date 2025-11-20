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
import { Prisma, Producto } from '@prisma/client';

@Controller('producto')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Post()
  async create(@Body() data: Prisma.ProductoCreateInput): Promise<Producto> {
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
    @Body() data: Prisma.ProductoUpdateInput,
  ): Promise<Producto> {
    return this.productoService.update(Number(id), data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Producto> {
    return this.productoService.remove(Number(id));
  }
}
