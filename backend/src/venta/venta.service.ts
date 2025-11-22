import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta } from '../entities/venta.entity';

@Injectable()
export class VentaService {
  constructor(
    @InjectRepository(Venta)
    private readonly ventaRepo: Repository<Venta>,
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

  create(data: Partial<Venta>): Promise<Venta> {
    // 1️⃣ Validar que el total venga definido
    if (data.total === undefined) {
      throw new Error('El total es obligatorio');
    }

    // 2️⃣ Calcular el total final de la venta con descuentos si aplica
    data.total = this.calcularTotalFinal(
      data.total,
      data.descuento_porcentaje,
      data.descuento_fijo,
    );

    // 3️⃣ Normalizar descuentos: solo uno puede aplicarse
    if (data.descuento_porcentaje) data.descuento_fijo = undefined;
    if (data.descuento_fijo) data.descuento_porcentaje = undefined;

    // 4️⃣ Crear la instancia de venta (aún no guardada en DB)
    const venta = this.ventaRepo.create(data);

    // 5️⃣ Aquí deberías:
    //    🔹 Guardar la venta en DB: await this.ventaRepo.save(venta)
    //    🔹 Recorres los items de la venta enviados desde el frontend (array de productos/juegos)
    //       por ejemplo: data.items = [{ productoId, juegoId, cantidad }]
    //    🔹 Por cada item:
    //       a) Llamar al JuegoService para disminuir stock del juego específico
    //          await this.juegoService.disminuirStock(item.juegoId, item.cantidad)
    //       b) Crear la relación en VentaProducto (producto, cantidad, precio_unitario)
    //          await this.ventaProductoService.create({ ventaId: venta.id, productoId: item.productoId, cantidad: item.cantidad, precio_unitario })
    //    🔹 Esto asegura que cada venta tiene sus productos y stock actualizados correctamente

    // 6️⃣ Finalmente devolver la venta ya guardada en DB
    return this.ventaRepo.save(venta);
  }

  findAll(): Promise<Venta[]> {
    return this.ventaRepo.find({
      relations: [
        'cliente',
        'vendedor',
        'ventaProducto',
        'ventaProducto.producto',
      ],
    });
  }

  findOne(id: number): Promise<Venta | null> {
    return this.ventaRepo.findOne({
      where: { id },
      relations: [
        'cliente',
        'vendedor',
        'ventaProducto',
        'ventaProducto.producto',
      ],
    });
  }
  async update(id: number, data: Partial<Venta>): Promise<Venta> {
    const result = await this.ventaRepo.update(id, data);
    if (result.affected === 0) {
      throw new NotFoundException(`Venta con id ${id} no encontrada`);
    }
    return this.findOne(id) as Promise<Venta>;
  }

  async remove(id: number): Promise<void> {
    const result = await this.ventaRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Venta con id ${id} no encontrada`);
    }
  }
}
