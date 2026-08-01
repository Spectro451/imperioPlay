import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { AddWishlistItemDto } from './dto/add-wishlist-item.dto';

@Controller('wishlist')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('cliente')
export class WishlistController {
  constructor(private readonly service: WishlistService) {}

  @Get()
  findMine(@Request() req) {
    return this.service.findByUsuario(req.user.id);
  }

  @Get('ids')
  findMyIds(@Request() req) {
    return this.service.findIdsByUsuario(req.user.id);
  }

  @Post()
  add(@Request() req, @Body() dto: AddWishlistItemDto) {
    return this.service.add(req.user.id, dto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.service.remove(req.user.id, id);
  }
}
