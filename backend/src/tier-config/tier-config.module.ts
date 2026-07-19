import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TierConfig } from 'src/entities/tier-config.entity';
import { TierConfigController } from './tier-config.controller';
import { TierConfigService } from './tier-config.service';

@Module({
  imports: [TypeOrmModule.forFeature([TierConfig])],
  controllers: [TierConfigController],
  providers: [TierConfigService],
  exports: [TierConfigService],
})
export class TierConfigModule {}
