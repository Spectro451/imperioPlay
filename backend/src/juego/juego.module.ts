import { Module } from '@nestjs/common';
import { JuegoController } from './juego.controller';
import { JuegoService } from './juego.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [JuegoController],
  providers: [JuegoService],
})
export class JuegoModule {}
