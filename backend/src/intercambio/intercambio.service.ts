import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Intercambio } from '../entities/intercambio.entity';
import { Juego } from 'src/entities/juego.entity';
import { VALOR_TIER } from 'src/constants/tiers.constant';
import { Producto } from 'src/entities/producto.entity';
import { Consola, estadoJuego, metodoPago } from 'src/entities/enums';
import { JuegoService } from 'src/juego/juego.service';
import { ProductoService } from 'src/producto/producto.service';
import { IntercambioJuegoService } from 'src/intercambio-juego/intercambio-juego.service';

@Injectable()
export class IntercambioService {
  constructor(
    @InjectRepository(Intercambio)
    private readonly intercambioRepo: Repository<Intercambio>,
    private readonly juegoService: JuegoService,
    private readonly productoService: ProductoService,
    private readonly intercambioJuegoService: IntercambioJuegoService,
  ) {}

  async validarTiers(
    juegoSolicitado: { tier: number; cantidad: number },
    juegosCliente: { tier: number; cantidad: number }[],
  ): Promise<{ cumple: boolean; faltante: number; faltanteTier: number }> {
    const totalCliente = juegosCliente.reduce(
      (acc, j) => acc + j.tier * j.cantidad,
      0,
    );

    const totalSolicitado = juegoSolicitado.tier * juegoSolicitado.cantidad;

    const tierFaltante = totalSolicitado - totalCliente;

    const maxTier = Math.max(...Object.keys(VALOR_TIER).map(Number));

    const faltanteValor =
      tierFaltante > 0
        ? tierFaltante <= maxTier
          ? VALOR_TIER[tierFaltante as keyof typeof VALOR_TIER]
          : VALOR_TIER[maxTier as keyof typeof VALOR_TIER] +
            15000 +
            (tierFaltante - maxTier - 1) * 5000
        : 0;

    return {
      cumple: tierFaltante <= 0,
      faltante: faltanteValor,
      faltanteTier: tierFaltante > 0 ? tierFaltante : 0,
    };
  }

  async intercambio(
    vendedorId: number,
    juegosSolicitadosData: Array<{ juegoId: number; cantidad?: number }>,
    juegosClienteData: {
      producto: Partial<Producto>;
      consola: Consola;
      estado?: estadoJuego;
      cantidad: number;
      fotos?: string[];
      precio_base: number;
      descuento_porcentaje?: number;
      descuento_fijo?: number;
    }[],
    clienteId?: number,
    dinero_extra: number = 0,
    metodo_pago?: metodoPago,
  ) {
    const juegosSolicitados: Array<{ juego: Juego; cantidad: number }> = [];
    for (const js of juegosSolicitadosData) {
      const juego = await this.juegoService.findOne(js.juegoId);
      if (!juego || juego.stock < (js.cantidad ?? 1))
        throw new BadRequestException(
          `Juego solicitado ${js.juegoId} no disponible`,
        );
      juegosSolicitados.push({ juego, cantidad: js.cantidad ?? 1 });
    }

    const juegosCliente: Array<{
      juego: Juego;
      tier: number;
      cantidad: number;
    }> = [];
    for (const data of juegosClienteData) {
      const producto = await this.productoService.crearProductoSiNoExiste(
        data.producto,
      );
      const juegoCliente = await this.juegoService.crearJuegoSiNoExiste(
        producto,
        {
          consola: data.consola,
          estado: data.estado ?? estadoJuego.usado,
          stock: data.cantidad,
          fotos: data.fotos,
          precio_base: data.precio_base,
          descuento_porcentaje: data.descuento_porcentaje,
          descuento_fijo: data.descuento_fijo,
        },
      );
      juegosCliente.push({
        juego: juegoCliente,
        tier: juegoCliente.tier,
        cantidad: data.cantidad,
      });
    }
    const totalSolicitado = juegosSolicitados.reduce(
      (acc, j) => acc + j.juego.tier * j.cantidad,
      0,
    );

    const totalCliente = juegosCliente.reduce(
      (acc, j) => acc + j.tier * j.cantidad,
      0,
    );

    const { cumple, faltante, faltanteTier } = await this.validarTiers(
      { tier: totalSolicitado, cantidad: 1 },
      [{ tier: totalCliente, cantidad: 1 }],
    );

    const faltanteValorTotal = faltante;

    if (!cumple && dinero_extra < faltanteValorTotal) {
      throw new BadRequestException({
        mensaje: 'Tier insuficiente',
        detalle: {
          cumple,
          faltan_tier: faltanteTier,
          equivalente_dinero: faltanteValorTotal,
        },
      });
    }

    for (const js of juegosSolicitados) {
      await this.juegoService.restarStockJuego(js.juego, js.cantidad);
    }

    const intercambio = this.intercambioRepo.create({
      fecha: new Date(),
      vendedor_id: vendedorId,
      vendedor: { id: vendedorId },
      cliente_id: clienteId ?? undefined,
      cliente: clienteId ? { id: clienteId } : undefined,
      dinero_extra: dinero_extra >= faltanteValorTotal ? faltanteValorTotal : 0,
      metodo_pago: faltanteValorTotal > 0 ? metodo_pago : undefined,
    });
    await this.intercambioRepo.save(intercambio);

    await this.intercambioJuegoService.crearVinculos(
      intercambio,
      juegosSolicitados,
      juegosCliente,
    );

    return {
      intercambio,
      faltante: faltanteValorTotal,
      dinero_extra_usado:
        dinero_extra >= faltanteValorTotal ? faltanteValorTotal : 0,
      juegosSolicitados,
      juegosCliente,
    };
  }

  create(data: Partial<Intercambio>): Promise<Intercambio> {
    const intercambio = this.intercambioRepo.create(data);
    return this.intercambioRepo.save(intercambio);
  }

  findAll(): Promise<Intercambio[]> {
    return this.intercambioRepo.find({
      relations: ['cliente', 'vendedor', 'intercambioJuegos'],
    });
  }

  findOne(id: number): Promise<Intercambio | null> {
    return this.intercambioRepo.findOne({
      where: { id },
      relations: ['cliente', 'vendedor', 'intercambioJuegos'],
    });
  }

  async update(id: number, data: Partial<Intercambio>): Promise<Intercambio> {
    await this.intercambioRepo.update(id, data);
    const updated = await this.findOne(id);
    if (!updated) {
      throw new Error(`Intercambio con id ${id} no encontrado`);
    }
    return updated;
  }

  async remove(id: number): Promise<void> {
    await this.intercambioRepo.delete(id);
  }
}
