import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JuegoController } from './juego.controller';
import { JuegoService } from './juego.service';
import { Juego } from '../entities/juego.entity';
import { ProductoModule } from 'src/producto/producto.module';
import { TierConfigModule } from 'src/tier-config/tier-config.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Juego]),
    ProductoModule,
    TierConfigModule,
  ],
  controllers: [JuegoController],
  providers: [JuegoService],
  exports: [JuegoService],
})
export class JuegoModule {}
