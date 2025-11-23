import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntercambioController } from './intercambio.controller';
import { IntercambioService } from './intercambio.service';
import { Intercambio } from '../entities/intercambio.entity';
import { JuegoModule } from 'src/juego/juego.module';
import { ProductoModule } from 'src/producto/producto.module';
import { IntercambioJuegoModule } from 'src/intercambio-juego/intercambio-juego.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Intercambio]),
    JuegoModule,
    ProductoModule,
    IntercambioJuegoModule,
  ],
  controllers: [IntercambioController],
  providers: [IntercambioService],
  exports: [IntercambioService],
})
export class IntercambioModule {}
