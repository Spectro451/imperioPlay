import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { IntercambioService } from './intercambio.service';
import { Intercambio } from '../entities/intercambio.entity';
import { Producto } from 'src/entities/producto.entity';
import { Consola, estadoJuego, metodoPago } from 'src/entities/enums';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('intercambio')
export class IntercambioController {
  constructor(private readonly intercambioService: IntercambioService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async crearIntercambio(
    @Req() req,
    @Body()
    body: {
      juegosSolicitadosData: Array<{ juegoId: number; cantidad?: number }>;
      juegosClienteData: {
        producto: Partial<Producto>;
        consola: Consola;
        estado?: estadoJuego;
        cantidad: number;
        fotos?: string[];
        precio_base: number;
        descuento_porcentaje?: number;
        descuento_fijo?: number;
      }[];
      clienteId?: number;
      dinero_extra?: number;
      metodo_pago?: metodoPago;
    },
  ) {
    const vendedorId = req.user.id;
    return this.intercambioService.intercambio(
      vendedorId,
      body.juegosSolicitadosData,
      body.juegosClienteData,
      body.clienteId,
      body.dinero_extra ?? 0,
      body.metodo_pago,
    );
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
