import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Intercambio } from '../entities/intercambio.entity';
import { Juego } from 'src/entities/juego.entity';
import { Producto } from 'src/entities/producto.entity';
import { IntercambioJuego } from 'src/entities/intercambioJuego.entity';
import { VALOR_TIER } from 'src/constants/tiers.constant';
import { Plataforma, estadoJuego, metodoPago, rolIntercambio } from 'src/entities/enums';
import { calcularPrecioFinal, calcularTier } from 'src/utils/pricing';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class IntercambioService {
  constructor(
    @InjectRepository(Intercambio)
    private readonly intercambioRepo: Repository<Intercambio>,
    private readonly dataSource: DataSource,
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

  private async resolverJuegosSolicitados(
    manager: EntityManager,
    data: Array<{ juegoId: number; cantidad?: number }>,
  ): Promise<Array<{ juego: Juego; cantidad: number }>> {
    const resultado: Array<{ juego: Juego; cantidad: number }> = [];
    for (const js of data) {
      const juego = await manager.findOne(Juego, {
        where: { id: js.juegoId },
        relations: ['producto'],
      });
      if (!juego || juego.stock < (js.cantidad ?? 1)) {
        throw new BadRequestException(
          `Juego solicitado ${js.juegoId} no disponible`,
        );
      }
      resultado.push({ juego, cantidad: js.cantidad ?? 1 });
    }
    return resultado;
  }

  private async upsertJuegoCliente(
    manager: EntityManager,
    data: {
      producto: Partial<Producto>;
      consola: Plataforma;
      estado?: estadoJuego;
      cantidad: number;
      fotos?: string[];
      precio_base: number;
      descuento_porcentaje?: number;
      descuento_fijo?: number;
    },
  ): Promise<Juego> {
    let producto = await manager.findOne(Producto, {
      where: { sku: data.producto.sku },
      relations: ['juegos'],
    });

    if (producto) {
      if (producto.tipo !== data.producto.tipo) {
        throw new BadRequestException(
          `SKU "${data.producto.sku}" ya está registrado para tipo "${producto.tipo}".`,
        );
      }
    } else {
      producto = await manager.save(
        Producto,
        manager.create(Producto, data.producto),
      );
      producto.juegos = [];
    }

    const estado = data.estado ?? estadoJuego.usado;
    const juegoExistente = producto.juegos?.find(
      (j) => j.consola === data.consola && j.estado === estado,
    );

    if (juegoExistente) {
      juegoExistente.stock += data.cantidad;
      return manager.save(Juego, juegoExistente);
    }

    let descuento_porcentaje = data.descuento_porcentaje;
    let descuento_fijo = data.descuento_fijo;
    if (descuento_porcentaje) descuento_fijo = 0;
    if (descuento_fijo) descuento_porcentaje = 0;

    const precio_final = calcularPrecioFinal(
      data.precio_base,
      descuento_porcentaje,
      descuento_fijo,
    );

    return manager.save(
      Juego,
      manager.create(Juego, {
        producto,
        consola: data.consola,
        precio_base: data.precio_base,
        estado,
        stock: data.cantidad,
        precio_final,
        tier: calcularTier(precio_final),
        fotos: data.fotos || [],
        descuento_porcentaje,
        descuento_fijo,
      }),
    );
  }

  private async decrementarStockSolicitados(
    manager: EntityManager,
    juegosSolicitados: Array<{ juego: Juego; cantidad: number }>,
  ): Promise<void> {
    for (const js of juegosSolicitados) {
      const result = await manager
        .createQueryBuilder()
        .update(Juego)
        .set({ stock: () => `stock - ${js.cantidad}` })
        .where('id = :id AND stock >= :cantidad', {
          id: js.juego.id,
          cantidad: js.cantidad,
        })
        .execute();
      if (!result.affected) {
        throw new BadRequestException(
          `Stock insuficiente para juego ${js.juego.id}`,
        );
      }
    }
  }

  private async crearVinculos(
    manager: EntityManager,
    intercambio: Intercambio,
    juegosSolicitados: Array<{ juego: Juego; cantidad: number }>,
    juegosCliente: Array<{ juego: Juego; cantidad: number }>,
  ): Promise<void> {
    const registros: IntercambioJuego[] = [
      ...juegosSolicitados.map((js) =>
        manager.create(IntercambioJuego, {
          intercambio,
          juego: js.juego,
          rol: rolIntercambio.solicitado,
          cantidad: js.cantidad,
        }),
      ),
      ...juegosCliente.map((j) =>
        manager.create(IntercambioJuego, {
          intercambio,
          juego: j.juego,
          rol: rolIntercambio.entregado,
          cantidad: j.cantidad,
        }),
      ),
    ];
    await manager.save(IntercambioJuego, registros);
  }

  async intercambio(
    vendedorId: number,
    juegosSolicitadosData: Array<{ juegoId: number; cantidad?: number }>,
    juegosClienteData: {
      producto: Partial<Producto>;
      consola: Plataforma;
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
    return this.dataSource.transaction(async (manager) => {
      const juegosSolicitados = await this.resolverJuegosSolicitados(
        manager,
        juegosSolicitadosData,
      );

      const juegosCliente: Array<{
        juego: Juego;
        tier: number;
        cantidad: number;
      }> = [];
      for (const data of juegosClienteData) {
        const juego = await this.upsertJuegoCliente(manager, data);
        juegosCliente.push({ juego, tier: juego.tier, cantidad: data.cantidad });
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

      if (!cumple && dinero_extra < faltante) {
        throw new BadRequestException({
          mensaje: 'Tier insuficiente',
          detalle: {
            cumple,
            faltan_tier: faltanteTier,
            equivalente_dinero: faltante,
          },
        });
      }

      await this.decrementarStockSolicitados(manager, juegosSolicitados);

      const intercambio = manager.create(Intercambio, {
        fecha: new Date(),
        vendedor_id: vendedorId,
        vendedor: { id: vendedorId },
        cliente_id: clienteId ?? undefined,
        cliente: clienteId ? { id: clienteId } : undefined,
        dinero_extra: dinero_extra >= faltante ? faltante : 0,
        metodo_pago: faltante > 0 ? metodo_pago : undefined,
      });
      await manager.save(Intercambio, intercambio);

      await this.crearVinculos(manager, intercambio, juegosSolicitados, juegosCliente);

      return {
        intercambio,
        faltante,
        dinero_extra_usado: dinero_extra >= faltante ? faltante : 0,
        juegosSolicitados,
        juegosCliente,
      };
    });
  }

  create(data: Partial<Intercambio>): Promise<Intercambio> {
    const intercambio = this.intercambioRepo.create(data);
    return this.intercambioRepo.save(intercambio);
  }

  async findAll(): Promise<Intercambio[]> {
    const intercambios = await this.intercambioRepo.find({
      relations: ['cliente', 'vendedor', 'intercambioJuegos'],
    });
    return instanceToPlain(intercambios) as Intercambio[];
  }

  async findOne(id: number): Promise<Intercambio | null> {
    const intercambio = await this.intercambioRepo.findOne({
      where: { id },
      relations: ['cliente', 'vendedor', 'intercambioJuegos'],
    });
    return intercambio ? (instanceToPlain(intercambio) as Intercambio) : null;
  }

  async update(id: number, data: Partial<Intercambio>): Promise<Intercambio> {
    await this.intercambioRepo.update(id, data);
    const updated = await this.findOne(id);
    if (!updated) {
      throw new BadRequestException(`Intercambio con id ${id} no encontrado`);
    }
    return updated;
  }

  async remove(id: number): Promise<void> {
    const result = await this.intercambioRepo.delete(id);
    if (!result.affected) {
      throw new BadRequestException(`Intercambio con id ${id} no encontrado`);
    }
  }
}
