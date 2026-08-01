import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishlistItem } from 'src/entities/wishlist-item.entity';
import { Juego } from 'src/entities/juego.entity';
import { Consola } from 'src/entities/consola';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';

@Module({
  imports: [TypeOrmModule.forFeature([WishlistItem, Juego, Consola])],
  controllers: [WishlistController],
  providers: [WishlistService],
})
export class WishlistModule {}
