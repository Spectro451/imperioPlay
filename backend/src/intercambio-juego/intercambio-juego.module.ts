import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntercambioJuegoController } from './intercambio-juego.controller';
import { IntercambioJuegoService } from './intercambio-juego.service';
import { IntercambioJuego } from '../entities/intercambioJuego.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IntercambioJuego])],
  controllers: [IntercambioJuegoController],
  providers: [IntercambioJuegoService],
  exports: [IntercambioJuegoService],
})
export class IntercambioJuegoModule {}
