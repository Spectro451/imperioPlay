import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VentaController } from './venta.controller';
import { VentaService } from './venta.service';
import { Venta } from '../entities/venta.entity';
import { JuegoModule } from 'src/juego/juego.module';
import { ConsolaModule } from 'src/consola/consola.module';

@Module({
  imports: [TypeOrmModule.forFeature([Venta]), JuegoModule, ConsolaModule],
  controllers: [VentaController],
  providers: [VentaService],
  exports: [VentaService],
})
export class VentaModule {}
