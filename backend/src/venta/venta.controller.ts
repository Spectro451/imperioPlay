import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { VentaService } from './venta.service';
import { Venta } from '../entities/venta.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { CreateVentaDto } from './dto/create-venta.dto';
import { FiltroVentasDto } from './dto/filtro-ventas.dto';

@Controller('venta')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VentaController {
  constructor(private readonly ventaService: VentaService) {}

  @Post()
  @Roles('admin', 'empleado')
  async create(@Body() data: CreateVentaDto, @Req() req: any): Promise<Venta> {
    return this.ventaService.create(req.user.id, data);
  }

  @Get()
  @Roles('admin', 'empleado')
  async findAll(@Query() filtro: FiltroVentasDto) {
    return this.ventaService.findAll(filtro);
  }

  @Get(':id')
  @Roles('admin', 'empleado')
  async findOne(@Param('id') id: string): Promise<Venta | null> {
    return this.ventaService.findOne(Number(id));
  }

  @Put(':id')
  @Roles('admin')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<Venta>,
  ): Promise<Venta> {
    return this.ventaService.update(Number(id), data);
  }

  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id') id: string): Promise<{ mensaje: string }> {
    return this.ventaService.remove(Number(id));
  }
}
