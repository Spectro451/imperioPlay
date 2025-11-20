import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioService } from './usuario/usuario.service';
import { JuegoService } from './juego/juego.service';
import { ProductoService } from './producto/producto.service';
import { VentaService } from './venta/venta.service';
import { VentaJuegoService } from './venta-juego/venta-juego.service';
import { IntercambioService } from './intercambio/intercambio.service';
import { IntercambioJuegoService } from './intercambio-juego/intercambio-juego.service';
import { UsuarioModule } from './usuario/usuario.module';
import { JuegoModule } from './juego/juego.module';
import { ProductoModule } from './producto/producto.module';
import { VentaModule } from './venta/venta.module';
import { VentaJuegoModule } from './venta-juego/venta-juego.module';
import { IntercambioModule } from './intercambio/intercambio.module';
import { IntercambioJuegoModule } from './intercambio-juego/intercambio-juego.module';

@Module({
  imports: [UsuarioModule, JuegoModule, ProductoModule, VentaModule, VentaJuegoModule, IntercambioModule, IntercambioJuegoModule],
  controllers: [AppController],
  providers: [AppService, UsuarioService, JuegoService, ProductoService, VentaService, VentaJuegoService, IntercambioService, IntercambioJuegoService],
})
export class AppModule {}
