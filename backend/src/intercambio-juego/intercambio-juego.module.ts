import { Module } from '@nestjs/common';
import { IntercambioJuegoController } from './intercambio-juego.controller';
import { IntercambioJuegoService } from './intercambio-juego.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [IntercambioJuegoController],
  providers: [IntercambioJuegoService],
})
export class IntercambioJuegoModule {}
