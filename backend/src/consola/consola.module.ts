import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsolaController } from './consola.controller';
import { ConsolaService } from './consola.service';
import { Consola } from '../entities/consola';
import { ProductoModule } from 'src/producto/producto.module';

@Module({
  imports: [TypeOrmModule.forFeature([Consola]), ProductoModule],
  controllers: [ConsolaController],
  providers: [ConsolaService],
  exports: [ConsolaService],
})
export class ConsolaModule {}
