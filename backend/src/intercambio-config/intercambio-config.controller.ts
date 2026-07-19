import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { IntercambioConfigService } from './intercambio-config.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UpdateIntercambioConfigDto } from './dto/update-intercambio-config.dto';

@Controller('intercambio-config')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class IntercambioConfigController {
  constructor(private readonly service: IntercambioConfigService) {}

  @Get()
  get() {
    return this.service.get();
  }

  @Patch()
  update(@Body() data: UpdateIntercambioConfigDto) {
    return this.service.update(data);
  }
}
