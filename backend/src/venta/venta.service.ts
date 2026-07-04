import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Venta } from '../entities/venta.entity';
import { metodoPago, tipoProducto } from 'src/entities/enums';
import { VentaDetalle } from 'src/entities/ventaDetalle';
import { instanceToPlain } from 'class-transformer';
import { Juego } from 'src/entities/juego.entity';
import { Consola } from 'src/entities/consola';
import { calcularPrecioFinal } from 'src/utils/pricing';

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

  async findAll(): Promise<Venta[]> {
    const ventas = await this.ventaRepo.find({
      relations: ['cliente', 'vendedor', 'ventaDetalles'],
    });
    return instanceToPlain(ventas) as Venta[];
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
