import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntercambioController } from './intercambio.controller';
import { IntercambioService } from './intercambio.service';
import { Intercambio } from '../entities/intercambio.entity';
import { UsuarioModule } from '../usuario/usuario.module';
import { JuegoModule } from '../juego/juego.module';
import { TierConfigModule } from '../tier-config/tier-config.module';
import { IntercambioConfigModule } from '../intercambio-config/intercambio-config.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Intercambio]),
    UsuarioModule,
    JuegoModule,
    TierConfigModule,
    IntercambioConfigModule,
  ],
  controllers: [IntercambioController],
  providers: [IntercambioService],
  exports: [IntercambioService],
})
export class IntercambioModule {}
