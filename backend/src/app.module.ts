import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { UsuarioModule } from './usuario/usuario.module';
import { JuegoModule } from './juego/juego.module';
import { ProductoModule } from './producto/producto.module';
import { VentaModule } from './venta/venta.module';
import { IntercambioModule } from './intercambio/intercambio.module';
import { AuthModule } from './auth/auth.module';

import { Usuario } from './entities/usuario.entity';
import { Juego } from './entities/juego.entity';
import { Producto } from './entities/producto.entity';
import { Venta } from './entities/venta.entity';
import { VentaDetalle } from './entities/ventaDetalle';
import { Intercambio } from './entities/intercambio.entity';
import { IntercambioJuego } from './entities/intercambioJuego.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConsolaModule } from './consola/consola.module';
import { Consola } from './entities/consola';
import { TierConfigModule } from './tier-config/tier-config.module';
import { IntercambioConfigModule } from './intercambio-config/intercambio-config.module';
import { TierConfig } from './entities/tier-config.entity';
import { IntercambioConfig } from './entities/intercambio-config.entity';
import { WishlistModule } from './wishlist/wishlist.module';
import { WishlistItem } from './entities/wishlist-item.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      { name: 'default', ttl: 60_000, limit: 120 },
    ]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [
        Usuario,
        Producto,
        Juego,
        Venta,
        VentaDetalle,
        Consola,
        Intercambio,
        IntercambioJuego,
        TierConfig,
        IntercambioConfig,
        WishlistItem,
      ],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    UsuarioModule,
    JuegoModule,
    ProductoModule,
    VentaModule,
    IntercambioModule,
    AuthModule,
    ConsolaModule,
    TierConfigModule,
    IntercambioConfigModule,
    WishlistModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
