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
import { ProductoService } from 'src/producto/producto.service';
import { Producto } from 'src/entities/producto.entity';
import { Consola, estadoJuego } from 'src/entities/enums';

@Controller('juego')
export class JuegoController {
  constructor(
    private readonly juegoService: JuegoService,
    private readonly productoService: ProductoService,
  ) {}

  @Post()
  async create(
    @Body()
    data: {
      producto: Partial<Producto>;
      juego: {
        consola: Consola;
        estado: estadoJuego;
        cantidad: number;
        fotos?: string[];
      };
    },
  ) {
    const producto = await this.productoService.crearProductoSiNoExiste(
      data.producto,
    );
    const juego = await this.juegoService.crearJuegoSiNoExiste(
      producto,
      data.juego,
    );

    return { producto, juego };
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
