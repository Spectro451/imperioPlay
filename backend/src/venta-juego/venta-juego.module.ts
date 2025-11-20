import { Module } from '@nestjs/common';
import { VentaJuegoController } from './venta-juego.controller';
import { VentaJuegoService } from './venta-juego.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VentaJuegoController],
  providers: [VentaJuegoService],
})
export class VentaJuegoModule {}
