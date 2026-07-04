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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { CreateIntercambioDto } from './dto/create-intercambio.dto';

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
    return this.intercambioService.intercambio(
      req.user.id,
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
