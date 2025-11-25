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
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('intercambio')
export class IntercambioController {
  constructor(private readonly intercambioService: IntercambioService) {}

  @Post()
  @Roles('admin', 'empleado')
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
  @Roles('admin', 'empleado')
  async findAll(): Promise<Intercambio[]> {
    return this.intercambioService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'empleado')
  async findOne(@Param('id') id: string): Promise<Intercambio | null> {
    return this.intercambioService.findOne(Number(id));
  }

  @Put(':id')
  @Roles('admin')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<Intercambio>,
  ): Promise<Intercambio> {
    return this.intercambioService.update(Number(id), data);
  }

  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id') id: string): Promise<void> {
    return this.intercambioService.remove(Number(id));
  }
}
