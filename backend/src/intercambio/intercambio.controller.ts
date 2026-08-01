import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { IntercambioService } from './intercambio.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { CreateIntercambioDto } from './dto/create-intercambio.dto';
import { FiltroIntercambiosDto } from './dto/filtro-intercambios.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('intercambio')
export class IntercambioController {
  constructor(private readonly intercambioService: IntercambioService) {}

  @Post()
  @Roles('admin', 'empleado')
  async crearIntercambio(
    @Req() req: any,
    @Body() body: CreateIntercambioDto,
  ) {
    const vendedor_id = body.vendedor_id ?? req.user.id;
    return this.intercambioService.intercambio(vendedor_id, {
      juegosSolicitadosData: body.juegosSolicitadosData,
      juegosClienteData: body.juegosClienteData,
      clienteId: body.clienteId,
      monto_pagado: body.monto_pagado,
      metodo_pago: body.metodo_pago,
    });
  }

  @Get()
  @Roles('admin', 'empleado')
  async findAll(@Query() filtro: FiltroIntercambiosDto) {
    return this.intercambioService.findAll(filtro);
  }

  @Get(':id')
  @Roles('admin', 'empleado')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.intercambioService.findOne(id);
  }

  @Delete(':id')
  @Roles('admin')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ mensaje: string }> {
    return this.intercambioService.remove(id);
  }
}
