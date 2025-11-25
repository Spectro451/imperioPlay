import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta } from '../entities/venta.entity';
import { JuegoService } from 'src/juego/juego.service';
import { metodoPago, tipoProducto } from 'src/entities/enums';
import { VentaDetalle } from 'src/entities/ventaDetalle';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class VentaService {
  constructor(
    @InjectRepository(Venta)
    private readonly ventaRepo: Repository<Venta>,
    private readonly juegoService: JuegoService,
  ) {}

  private calcularTotalFinal(
    total_base: number,
    descuento_porcentaje?: number,
    descuento_fijo?: number,
  ): number {
    descuento_porcentaje =
      descuento_porcentaje === 0 ? undefined : descuento_porcentaje;
    descuento_fijo = descuento_fijo === 0 ? undefined : descuento_fijo;

    if (descuento_porcentaje && descuento_fijo) {
      throw new Error('Solo puede haber un descuento a la vez');
    }

    if (descuento_porcentaje) {
      if (descuento_porcentaje > 100)
        throw new Error('El descuento porcentual no puede ser mayor al 100%');
      return Math.round(total_base * (1 - descuento_porcentaje / 100));
    }

    if (descuento_fijo) {
      if (descuento_fijo > total_base)
        throw new Error('El descuento fijo no puede ser mayor al total');
      return total_base - descuento_fijo;
    }

    return total_base;
  }

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
    let total_base = 0;
    const ventaDetalles: VentaDetalle[] = [];
    const juegosMap = new Map<number, any>();

    for (const item of data.items) {
      if (item.tipo !== tipoProducto.juego) {
        throw new Error(`Tipo de producto ${item.tipo} no implementado`);
      }

      const juego = await this.juegoService.findOne(item.id);
      if (!juego)
        throw new BadRequestException(
          `No se encontró el juego con id ${item.id}`,
        );

      juegosMap.set(item.id, juego);

      const subtotal = juego.precio_final * item.cantidad;
      total_base += subtotal;

      ventaDetalles.push(
        Object.assign(new VentaDetalle(), {
          item_id: juego.id,
          tipo: item.tipo,
          cantidad: item.cantidad,
          precio_unitario: juego.precio_final,
          subtotal,
        }),
      );
    }

    const total_final = this.calcularTotalFinal(
      total_base,
      data.descuento_porcentaje,
      data.descuento_fijo,
    );

    if (data.monto_pagado < total_final) {
      throw new BadRequestException(
        `Monto pagado insuficiente: se esperaba ${total_final}, pero se recibieron ${data.monto_pagado}`,
      );
    }

    for (const item of data.items) {
      const juego = juegosMap.get(item.id);
      await this.juegoService.restarStockJuego(juego, item.cantidad);
    }

    const venta = this.ventaRepo.create({
      fecha: new Date(),
      vendedor_id,
      cliente_id: data.cliente_id,
      descuento_porcentaje: data.descuento_porcentaje,
      descuento_fijo: data.descuento_fijo,
      total: total_final,
      monto_pagado: data.monto_pagado,
      metodo_pago: data.metodo_pago,
      VentaDetalle: ventaDetalles,
    });

    return this.ventaRepo.save(venta);
  }

  async findAll(): Promise<Venta[]> {
    const ventas = await this.ventaRepo.find({
      relations: ['cliente', 'vendedor', 'VentaDetalle'],
    });
    return instanceToPlain(ventas) as Venta[];
  }

  async findOne(id: number): Promise<Venta | null> {
    const venta = await this.ventaRepo.findOne({
      where: { id },
      relations: ['cliente', 'vendedor', 'VentaDetalle'],
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
