import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VentaProductoController } from './ventaProducto.controller';
import { VentaProductoService } from './ventaProducto.service';
import { VentaProducto } from '../entities/ventaProducto';

@Module({
  imports: [TypeOrmModule.forFeature([VentaProducto])],
  controllers: [VentaProductoController],
  providers: [VentaProductoService],
  exports: [VentaProductoService],
})
export class VentaProductoModule {}
