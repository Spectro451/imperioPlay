import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JuegoController } from './juego.controller';
import { JuegoService } from './juego.service';
import { Juego } from '../entities/juego.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Juego])],
  controllers: [JuegoController],
  providers: [JuegoService],
  exports: [JuegoService],
})
export class JuegoModule {}
