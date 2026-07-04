import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntercambioController } from './intercambio.controller';
import { IntercambioService } from './intercambio.service';
import { Intercambio } from '../entities/intercambio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Intercambio])],
  controllers: [IntercambioController],
  providers: [IntercambioService],
  exports: [IntercambioService],
})
export class IntercambioModule {}
