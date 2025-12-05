import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsolaController } from './consola.controller';
import { ConsolaService } from './consola.service';
import { Consolas } from '../entities/consola';
import { ProductoModule } from 'src/producto/producto.module';

@Module({
  imports: [TypeOrmModule.forFeature([Consolas]), ProductoModule],
  controllers: [ConsolaController],
  providers: [ConsolaService],
  exports: [ConsolaService],
})
export class ConsolaModule {}
