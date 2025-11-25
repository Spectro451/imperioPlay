import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VentaProductoController } from './ventaProducto.controller';
import { VentaDetalleService } from './ventaProducto.service';
import { VentaDetalle } from '../entities/ventaDetalle';

@Module({
  imports: [TypeOrmModule.forFeature([VentaDetalle])],
  controllers: [VentaProductoController],
  providers: [VentaDetalleService],
  exports: [VentaDetalleService],
})
export class VentaProductoModule {}
