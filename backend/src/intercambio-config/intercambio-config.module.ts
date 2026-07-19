import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntercambioConfig } from 'src/entities/intercambio-config.entity';
import { IntercambioConfigController } from './intercambio-config.controller';
import { IntercambioConfigService } from './intercambio-config.service';

@Module({
  imports: [TypeOrmModule.forFeature([IntercambioConfig])],
  controllers: [IntercambioConfigController],
  providers: [IntercambioConfigService],
  exports: [IntercambioConfigService],
})
export class IntercambioConfigModule {}
