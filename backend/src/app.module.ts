import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsuarioModule } from './usuario/usuario.module';
import { JuegoModule } from './juego/juego.module';
import { ProductoModule } from './producto/producto.module';
import { VentaModule } from './venta/venta.module';
import { VentaProductoModule } from './ventaProducto/ventaProducto.module';
import { IntercambioModule } from './intercambio/intercambio.module';
import { IntercambioJuegoModule } from './intercambio-juego/intercambio-juego.module';
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
import { Consolas } from './entities/consola';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [
        Usuario,
        Producto,
        Juego,
        Venta,
        VentaDetalle,
        Consolas,
        Intercambio,
        IntercambioJuego,
      ],
      synchronize: true,
    }),
    UsuarioModule,
    JuegoModule,
    ProductoModule,
    VentaModule,
    VentaProductoModule,
    IntercambioModule,
    IntercambioJuegoModule,
    AuthModule,
    ConsolaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
