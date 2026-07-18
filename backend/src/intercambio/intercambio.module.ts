import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntercambioController } from './intercambio.controller';
import { IntercambioService } from './intercambio.service';
import { Intercambio } from '../entities/intercambio.entity';
import { UsuarioModule } from '../usuario/usuario.module';
import { JuegoModule } from '../juego/juego.module';

@Module({
  imports: [TypeOrmModule.forFeature([Intercambio]), UsuarioModule, JuegoModule],
  controllers: [IntercambioController],
  providers: [IntercambioService],
  exports: [IntercambioService],
})
export class IntercambioModule {}
