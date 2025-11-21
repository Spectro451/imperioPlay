import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VentaJuegoController } from './venta-juego.controller';
import { VentaJuegoService } from './venta-juego.service';
import { VentaJuego } from '../entities/ventaJuego.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VentaJuego])],
  controllers: [VentaJuegoController],
  providers: [VentaJuegoService],
  exports: [VentaJuegoService],
})
export class VentaJuegoModule {}
