import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { Venta } from '../entities/venta.entity';
import { metodoPago, tipoProducto } from 'src/entities/enums';
import { VentaDetalle } from 'src/entities/ventaDetalle';
import { instanceToPlain } from 'class-transformer';
import { Juego } from 'src/entities/juego.entity';
import { Consola } from 'src/entities/consola';
import { calcularPrecioFinal } from 'src/utils/pricing';
import { FiltroVentasDto, OrdenVentas } from './dto/filtro-ventas.dto';

interface DatosVariante {
  nombre: string;
  estado: string;
}

export interface DetalleListado {
  nombre: string;
  tipo: tipoProducto;
  estado: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface VentaListado {
  id: number;
  fecha: Date;
  metodo_pago: metodoPago;
  total: number;
  monto_pagado: number;
  vuelto?: number;
  descuento_porcentaje?: number;
  descuento_fijo?: number;
  vendedor: { id: number; nombre: string };
  items: DetalleListado[];
}

export interface ListadoVentas {
  ventas: VentaListado[];
  totalPaginas: number;
  totalRegistros: number;
}

const LIMIT_POR_DEFECTO = 20;

@Injectable()
export class VentaService {
  constructor(
    @InjectRepository(Venta)
    private readonly ventaRepo: Repository<Venta>,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    vendedor_id: number,
    data: {
      cliente_id?: number;
      descuento_porcentaje?: number;
      descuento_fijo?: number;
      metodo_pago: metodoPago;
      monto_pagado: number;
      items: { id: number; tipo: tipoProducto; cantidad: number }[];
    },
  ): Promise<Venta> {
    return this.dataSource.transaction(async (manager) => {
      let total_base = 0;
      const ventaDetalles: VentaDetalle[] = [];

      for (const item of data.items) {
        let precio_final = 0;

        if (item.tipo === tipoProducto.juego) {
          const juego = await manager.findOne(Juego, { where: { id: item.id } });
          if (!juego)
            throw new BadRequestException(`Juego ${item.id} no encontrado`);
          precio_final = juego.precio_final;
        } else if (item.tipo === tipoProducto.consola) {
          const consola = await manager.findOne(Consola, {
            where: { id: item.id },
          });
          if (!consola)
            throw new BadRequestException(`Consola ${item.id} no encontrada`);
          precio_final = consola.precio_final;
        } else {
          throw new BadRequestException(`Tipo ${item.tipo} no soportado`);
        }

        const subtotal = precio_final * item.cantidad;
        total_base += subtotal;

        ventaDetalles.push(
          Object.assign(new VentaDetalle(), {
            item_id: item.id,
            tipo: item.tipo,
            cantidad: item.cantidad,
            precio_unitario: precio_final,
            subtotal,
          }),
        );
      }

      const total_final = calcularPrecioFinal(
        total_base,
        data.descuento_porcentaje,
        data.descuento_fijo,
      );

      if (data.monto_pagado < total_final) {
        throw new BadRequestException(
          `Monto pagado insuficiente: se esperaba ${total_final}, recibido ${data.monto_pagado}`,
        );
      }

      for (const item of data.items) {
        if (item.tipo === tipoProducto.juego) {
          const result = await manager
            .createQueryBuilder()
            .update(Juego)
            .set({ stock: () => `stock - ${item.cantidad}` })
            .where('id = :id AND stock >= :cantidad', {
              id: item.id,
              cantidad: item.cantidad,
            })
            .execute();
          if (!result.affected)
            throw new BadRequestException(
              `Stock insuficiente para juego ${item.id}`,
            );
        } else if (item.tipo === tipoProducto.consola) {
          const result = await manager
            .createQueryBuilder()
            .update(Consola)
            .set({ stock: () => `stock - ${item.cantidad}` })
            .where('id = :id AND stock >= :cantidad', {
              id: item.id,
              cantidad: item.cantidad,
            })
            .execute();
          if (!result.affected)
            throw new BadRequestException(
              `Stock insuficiente para consola ${item.id}`,
            );
        }
      }

      const vuelto = data.monto_pagado - total_final;

      const venta = manager.create(Venta, {
        fecha: new Date(),
        vendedor_id,
        cliente_id: data.cliente_id,
        descuento_porcentaje: data.descuento_porcentaje,
        descuento_fijo: data.descuento_fijo,
        total: total_final,
        monto_pagado: data.monto_pagado,
        metodo_pago: data.metodo_pago,
        ventaDetalles: ventaDetalles,
        vuelto: vuelto > 0 ? vuelto : 0,
      });

      return manager.save(Venta, venta);
    });
  }

  async findAll(filtro: FiltroVentasDto = {}): Promise<ListadoVentas> {
    const { ventas, totalRegistros, totalPaginas } =
      await this.buscarConFiltros(filtro);
    const mapaVariantes = await this.resolverCatalogo(ventas);
    const listado = ventas.map((v) => this.mapearListado(v, mapaVariantes));
    return { ventas: listado, totalPaginas, totalRegistros };
  }

  private async buscarConFiltros(filtro: FiltroVentasDto): Promise<{
    ventas: Venta[];
    totalRegistros: number;
    totalPaginas: number;
  }> {
    const page = filtro.page ?? 1;
    const limit = filtro.limit ?? LIMIT_POR_DEFECTO;

    const qb = this.ventaRepo
      .createQueryBuilder('venta')
      .leftJoinAndSelect('venta.vendedor', 'vendedor')
      .leftJoinAndSelect('venta.ventaDetalles', 'detalle');

    this.aplicarOrden(qb, filtro.orden);

    if (filtro.desde) qb.andWhere('venta.fecha >= :desde', { desde: filtro.desde });
    if (filtro.hasta) qb.andWhere('venta.fecha <= :hasta', { hasta: filtro.hasta });
    if (filtro.vendedor_id)
      qb.andWhere('venta.vendedor_id = :vendedor_id', {
        vendedor_id: filtro.vendedor_id,
      });
    if (filtro.metodo_pago)
      qb.andWhere('venta.metodo_pago = :metodo_pago', {
        metodo_pago: filtro.metodo_pago,
      });

    const totalRegistros = await qb.getCount();
    const totalPaginas = Math.max(1, Math.ceil(totalRegistros / limit));

    qb.skip((page - 1) * limit).take(limit);
    const ventas = await qb.getMany();

    return { ventas, totalRegistros, totalPaginas };
  }

  private async resolverCatalogo(
    ventas: Venta[],
  ): Promise<Map<string, DatosVariante>> {
    const idsJuego = new Set<number>();
    const idsConsola = new Set<number>();

    for (const v of ventas) {
      for (const d of v.ventaDetalles ?? []) {
        if (d.tipo === tipoProducto.juego) idsJuego.add(d.item_id);
        else if (d.tipo === tipoProducto.consola) idsConsola.add(d.item_id);
      }
    }

    const mapa = new Map<string, DatosVariante>();
    if (!idsJuego.size && !idsConsola.size) return mapa;

    const [juegos, consolas] = await Promise.all([
      idsJuego.size
        ? this.dataSource
            .getRepository(Juego)
            .createQueryBuilder('juego')
            .leftJoinAndSelect('juego.producto', 'producto')
            .whereInIds([...idsJuego])
            .getMany()
        : Promise.resolve([]),
      idsConsola.size
        ? this.dataSource
            .getRepository(Consola)
            .createQueryBuilder('consola')
            .leftJoinAndSelect('consola.producto', 'producto')
            .whereInIds([...idsConsola])
            .getMany()
        : Promise.resolve([]),
    ]);

    for (const j of juegos) {
      mapa.set(this.keyVariante(tipoProducto.juego, j.id), {
        nombre: j.producto?.nombre ?? 'Producto eliminado',
        estado: j.estado,
      });
    }
    for (const c of consolas) {
      mapa.set(this.keyVariante(tipoProducto.consola, c.id), {
        nombre: c.producto?.nombre ?? 'Producto eliminado',
        estado: c.estado,
      });
    }

    return mapa;
  }

  private keyVariante(tipo: tipoProducto, id: number): string {
    return `${tipo}-${id}`;
  }

  private aplicarOrden(
    qb: SelectQueryBuilder<Venta>,
    orden?: OrdenVentas,
  ): void {
    const mapa = {
      'fecha-asc': ['venta.fecha', 'ASC'],
      'fecha-desc': ['venta.fecha', 'DESC'],
      'total-asc': ['venta.total', 'ASC'],
      'total-desc': ['venta.total', 'DESC'],
    } as const;
    const [campo, dir] = mapa[orden ?? 'fecha-desc'];
    qb.orderBy(campo, dir).addOrderBy('venta.id', 'DESC');
  }

  private mapearListado(
    venta: Venta,
    mapa: Map<string, DatosVariante>,
  ): VentaListado {
    const items: DetalleListado[] = (venta.ventaDetalles ?? []).map((d) => {
      const datos = mapa.get(this.keyVariante(d.tipo, d.item_id));
      return {
        nombre: datos?.nombre ?? 'Producto eliminado',
        tipo: d.tipo,
        estado: datos?.estado ?? '—',
        cantidad: d.cantidad,
        precio_unitario: d.precio_unitario,
        subtotal: d.subtotal,
      };
    });

    return {
      id: venta.id,
      fecha: venta.fecha,
      metodo_pago: venta.metodo_pago,
      total: venta.total,
      monto_pagado: venta.monto_pagado,
      vuelto: venta.vuelto,
      descuento_porcentaje: venta.descuento_porcentaje,
      descuento_fijo: venta.descuento_fijo,
      vendedor: {
        id: venta.vendedor?.id ?? venta.vendedor_id,
        nombre: venta.vendedor?.nombre ?? '—',
      },
      items,
    };
  }

  async findOne(id: number): Promise<Venta | null> {
    const venta = await this.ventaRepo.findOne({
      where: { id },
      relations: ['cliente', 'vendedor', 'ventaDetalles'],
    });
    return venta ? (instanceToPlain(venta) as Venta) : null;
  }

  async update(id: number, data: Partial<Venta>): Promise<Venta> {
    const result = await this.ventaRepo.update(id, data);
    if (result.affected === 0) {
      throw new NotFoundException(`Venta con id ${id} no encontrada`);
    }
    return this.findOne(id) as Promise<Venta>;
  }

  async remove(id: number): Promise<{ mensaje: string }> {
    const result = await this.ventaRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Venta con id ${id} no encontrada`);
    }
    return { mensaje: `Venta con id ${id} eliminada correctamente` };
  }
}
