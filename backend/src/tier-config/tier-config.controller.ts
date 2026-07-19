import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TierConfigService } from './tier-config.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { CreateTierConfigDto } from './dto/create-tier-config.dto';
import { UpdateTierConfigDto } from './dto/update-tier-config.dto';

@Controller('tier-config')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class TierConfigController {
  constructor(private readonly service: TierConfigService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  create(@Body() data: CreateTierConfigDto) {
    return this.service.create(data);
  }

  @Patch(':tier')
  update(
    @Param('tier', ParseIntPipe) tier: number,
    @Body() data: UpdateTierConfigDto,
  ) {
    return this.service.update(tier, data.valor);
  }

  @Delete(':tier')
  remove(@Param('tier', ParseIntPipe) tier: number) {
    return this.service.remove(tier);
  }
}
