import { Module } from '@nestjs/common';
import { IntercambioController } from './intercambio.controller';
import { IntercambioService } from './intercambio.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [IntercambioController],
  providers: [IntercambioService],
})
export class IntercambioModule {}
