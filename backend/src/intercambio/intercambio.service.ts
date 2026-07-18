import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { Intercambio } from '../entities/intercambio.entity';
import { Juego } from 'src/entities/juego.entity';
import { IntercambioJuego } from 'src/entities/intercambioJuego.entity';
import { VALOR_TIER } from 'src/constants/tiers.constant';
import { Plataforma, estadoJuego, metodoPago, rolIntercambio, tipoProducto } from 'src/entities/enums';
import { instanceToPlain } from 'class-transformer';
import { UsuarioService } from 'src/usuario/usuario.service';
import { JuegoService } from 'src/juego/juego.service';
import {
  FiltroIntercambiosDto,
  OrdenIntercambios,
} from './dto/filtro-intercambios.dto';

interface DatosJuego {
  nombre: string;
  sku?: string;
  consola: Plataforma;
  estado: estadoJuego;
  tier: number;
}

export interface DetalleIntercambioListado {
  juego_id: number;
  rol: rolIntercambio;
  cantidad: number;
  nombre: string;
  sku?: string;
  consola: Plataforma;
  estado: estadoJuego;
  tier: number;
}

export interface IntercambioListado {
  id: number;
  fecha: Date;
  metodo_pago?: metodoPago;
  dinero_extra?: number;
  monto_pagado?: number;
  vuelto?: number;
  vendedor: { id: number; nombre: string };
  cliente?: { id: number; nombre: string };
  items: DetalleIntercambioListado[];
}

export interface ListadoIntercambios {
  intercambios: IntercambioListado[];
  totalPaginas: number;
  totalRegistros: number;
}

const LIMIT_POR_DEFECTO = 20;

@Injectable()
export class IntercambioService {
  constructor(
    @InjectRepository(Intercambio)
    private readonly intercambioRepo: Repository<Intercambio>,
    private readonly dataSource: DataSource,
    private readonly usuarioService: UsuarioService,
    private readonly juegoService: JuegoService,
  ) {}

  calcularFaltante(totalSolicitado: number, totalCliente: number): {
    cumple: boolean;
    faltanteTier: number;
    dinero_extra: number;
  } {
    const faltanteTier = totalSolicitado - totalCliente;
    if (faltanteTier <= 0) {
      return { cumple: true, faltanteTier: 0, dinero_extra: 0 };
    }
    const maxTier = Math.max(...Object.keys(VALOR_TIER).map(Number));
    const dinero_extra =
      faltanteTier <= maxTier
        ? VALOR_TIER[faltanteTier as keyof typeof VALOR_TIER]
        : VALOR_TIER[maxTier as keyof typeof VALOR_TIER] +
          15000 +
          (faltanteTier - maxTier - 1) * 5000;
    return { cumple: false, faltanteTier, dinero_extra };
  }

  private async resolverJuegosSolicitados(
    manager: EntityManager,
    data: Array<{ juegoId: number; cantidad?: number }>,
  ): Promise<Array<{ juego: Juego; cantidad: number }>> {
    const resultado: Array<{ juego: Juego; cantidad: number }> = [];
    for (const js of data) {
      const juego = await manager.findOne(Juego, {
        where: { id: js.juegoId, isActive: true },
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
    vendedor_id: number,
    data: {
      juegosSolicitadosData: Array<{ juegoId: number; cantidad?: number }>;
      juegosClienteData: Array<{
        producto: { nombre: string; tipo: tipoProducto; sku: string };
        consola: Plataforma;
        estado?: estadoJuego;
        cantidad: number;
        fotos?: string[];
        precio_base: number;
        descuento_porcentaje?: number;
        descuento_fijo?: number;
      }>;
      clienteId?: number;
      monto_pagado?: number;
      metodo_pago?: metodoPago;
    },
  ) {
    await this.usuarioService.validarVendedor(vendedor_id);

    return this.dataSource.transaction(async (manager) => {
      const juegosSolicitados = await this.resolverJuegosSolicitados(
        manager,
        data.juegosSolicitadosData,
      );

      const juegosCliente: Array<{ juego: Juego; cantidad: number }> = [];
      for (const jc of data.juegosClienteData) {
        const { juego } = await this.juegoService.upsertConProducto(
          jc.producto,
          {
            consola: jc.consola,
            estado: jc.estado,
            stock: jc.cantidad,
            fotos: jc.fotos,
            precio_base: jc.precio_base,
            descuento_porcentaje: jc.descuento_porcentaje,
            descuento_fijo: jc.descuento_fijo,
          },
          manager,
        );
        juegosCliente.push({ juego, cantidad: jc.cantidad });
      }

      const totalSolicitado = juegosSolicitados.reduce(
        (acc, j) => acc + j.juego.tier * j.cantidad,
        0,
      );
      const totalCliente = juegosCliente.reduce(
        (acc, j) => acc + j.juego.tier * j.cantidad,
        0,
      );

      const { cumple, faltanteTier, dinero_extra } = this.calcularFaltante(
        totalSolicitado,
        totalCliente,
      );

      const monto_pagado = data.monto_pagado ?? 0;
      if (!cumple) {
        if (!data.metodo_pago) {
          throw new BadRequestException(
            'Se requiere método de pago cuando hay diferencia de tier',
          );
        }
        if (monto_pagado < dinero_extra) {
          throw new BadRequestException({
            mensaje: 'Monto pagado insuficiente',
            detalle: {
              faltan_tier: faltanteTier,
              dinero_extra,
              monto_pagado,
            },
          });
        }
      }

      await this.decrementarStockSolicitados(manager, juegosSolicitados);

      const vuelto = dinero_extra > 0 ? monto_pagado - dinero_extra : 0;

      const intercambio = manager.create(Intercambio, {
        fecha: new Date(),
        vendedor_id,
        vendedor: { id: vendedor_id },
        cliente_id: data.clienteId ?? undefined,
        cliente: data.clienteId ? { id: data.clienteId } : undefined,
        dinero_extra: dinero_extra > 0 ? dinero_extra : undefined,
        monto_pagado: dinero_extra > 0 ? monto_pagado : undefined,
        vuelto: dinero_extra > 0 ? vuelto : undefined,
        metodo_pago: dinero_extra > 0 ? data.metodo_pago : undefined,
      });
      await manager.save(Intercambio, intercambio);

      await this.crearVinculos(
        manager,
        intercambio,
        juegosSolicitados,
        juegosCliente,
      );

      return {
        intercambio,
        dinero_extra,
        monto_pagado: dinero_extra > 0 ? monto_pagado : 0,
        vuelto: dinero_extra > 0 ? vuelto : 0,
        juegosSolicitados,
        juegosCliente,
      };
    });
  }

  async findAll(filtro: FiltroIntercambiosDto = {}): Promise<ListadoIntercambios> {
    const { intercambios, totalRegistros, totalPaginas } =
      await this.buscarConFiltros(filtro);
    const mapaJuegos = await this.resolverCatalogo(intercambios);
    const listado = intercambios.map((i) => this.mapearListado(i, mapaJuegos));
    return { intercambios: listado, totalPaginas, totalRegistros };
  }

  private async buscarConFiltros(filtro: FiltroIntercambiosDto): Promise<{
    intercambios: Intercambio[];
    totalRegistros: number;
    totalPaginas: number;
  }> {
    const page = filtro.page ?? 1;
    const limit = filtro.limit ?? LIMIT_POR_DEFECTO;

    const qb = this.intercambioRepo
      .createQueryBuilder('intercambio')
      .leftJoinAndSelect('intercambio.vendedor', 'vendedor')
      .leftJoinAndSelect('intercambio.cliente', 'cliente')
      .leftJoinAndSelect('intercambio.intercambioJuegos', 'ij')
      .loadRelationIdAndMap('ij.juegoId', 'ij.juego');

    this.aplicarOrden(qb, filtro.orden);

    if (filtro.desde)
      qb.andWhere('intercambio.fecha >= :desde', { desde: filtro.desde });
    if (filtro.hasta)
      qb.andWhere('intercambio.fecha <= :hasta', { hasta: filtro.hasta });
    if (filtro.vendedor_id)
      qb.andWhere('intercambio.vendedor_id = :vendedor_id', {
        vendedor_id: filtro.vendedor_id,
      });
    if (filtro.metodo_pago)
      qb.andWhere('intercambio.metodo_pago = :metodo_pago', {
        metodo_pago: filtro.metodo_pago,
      });

    const totalRegistros = await qb.getCount();
    const totalPaginas = Math.max(1, Math.ceil(totalRegistros / limit));

    qb.skip((page - 1) * limit).take(limit);
    const intercambios = await qb.getMany();

    return { intercambios, totalRegistros, totalPaginas };
  }

  private async resolverCatalogo(
    intercambios: Intercambio[],
  ): Promise<Map<number, DatosJuego>> {
    const ids = new Set<number>();
    for (const i of intercambios) {
      for (const ij of i.intercambioJuegos ?? []) {
        const juegoId = (ij as any).juegoId ?? ij.juego?.id;
        if (juegoId) ids.add(juegoId);
      }
    }

    const mapa = new Map<number, DatosJuego>();
    if (!ids.size) return mapa;

    const juegos = await this.dataSource
      .getRepository(Juego)
      .createQueryBuilder('juego')
      .leftJoinAndSelect('juego.producto', 'producto')
      .whereInIds([...ids])
      .getMany();

    for (const j of juegos) {
      mapa.set(j.id, {
        nombre: j.producto?.nombre ?? 'Producto eliminado',
        sku: j.producto?.sku,
        consola: j.consola,
        estado: j.estado,
        tier: j.tier,
      });
    }
    return mapa;
  }

  private aplicarOrden(
    qb: SelectQueryBuilder<Intercambio>,
    orden?: OrdenIntercambios,
  ): void {
    const mapa = {
      'fecha-asc': ['intercambio.fecha', 'ASC'],
      'fecha-desc': ['intercambio.fecha', 'DESC'],
      'dinero-asc': ['intercambio.dinero_extra', 'ASC'],
      'dinero-desc': ['intercambio.dinero_extra', 'DESC'],
    } as const;
    const [campo, dir] = mapa[orden ?? 'fecha-desc'];
    qb.orderBy(campo, dir).addOrderBy('intercambio.id', 'DESC');
  }

  private mapearListado(
    intercambio: Intercambio,
    mapa: Map<number, DatosJuego>,
  ): IntercambioListado {
    const items: DetalleIntercambioListado[] = (
      intercambio.intercambioJuegos ?? []
    ).map((ij) => {
      const juegoId = (ij as any).juegoId ?? ij.juego?.id;
      const datos = mapa.get(juegoId);
      return {
        juego_id: juegoId,
        rol: ij.rol,
        cantidad: ij.cantidad,
        nombre: datos?.nombre ?? 'Producto eliminado',
        sku: datos?.sku,
        consola: datos?.consola ?? ij.juego?.consola,
        estado: datos?.estado ?? ij.juego?.estado ?? estadoJuego.usado,
        tier: datos?.tier ?? 0,
      };
    });

    return {
      id: intercambio.id,
      fecha: intercambio.fecha,
      metodo_pago: intercambio.metodo_pago,
      dinero_extra: intercambio.dinero_extra,
      monto_pagado: intercambio.monto_pagado,
      vuelto: intercambio.vuelto,
      vendedor: {
        id: intercambio.vendedor?.id ?? intercambio.vendedor_id,
        nombre: intercambio.vendedor?.nombre ?? '—',
      },
      cliente: intercambio.cliente
        ? { id: intercambio.cliente.id, nombre: intercambio.cliente.nombre }
        : undefined,
      items,
    };
  }

  async findOne(id: number): Promise<IntercambioListado | null> {
    const intercambio = await this.intercambioRepo.findOne({
      where: { id },
      relations: ['cliente', 'vendedor', 'intercambioJuegos', 'intercambioJuegos.juego'],
    });
    if (!intercambio) return null;
    const mapa = await this.resolverCatalogo([intercambio]);
    return this.mapearListado(intercambio, mapa);
  }

  async update(id: number, data: Partial<Intercambio>): Promise<Intercambio> {
    const result = await this.intercambioRepo.update(id, data);
    if (result.affected === 0) {
      throw new NotFoundException(`Intercambio con id ${id} no encontrado`);
    }
    const updated = await this.intercambioRepo.findOne({
      where: { id },
      relations: ['cliente', 'vendedor', 'intercambioJuegos'],
    });
    return instanceToPlain(updated) as Intercambio;
  }

  async remove(id: number): Promise<{ mensaje: string }> {
    const result = await this.intercambioRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Intercambio con id ${id} no encontrado`);
    }
    return { mensaje: `Intercambio con id ${id} eliminado correctamente` };
  }
}
