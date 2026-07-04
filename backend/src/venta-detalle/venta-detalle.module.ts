import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VentaDetalleController } from './venta-detalle.controller';
import { VentaDetalleService } from './venta-detalle.service';
import { VentaDetalle } from '../entities/ventaDetalle';

@Module({
  imports: [TypeOrmModule.forFeature([VentaDetalle])],
  controllers: [VentaDetalleController],
  providers: [VentaDetalleService],
  exports: [VentaDetalleService],
})
export class VentaDetalleModule {}
