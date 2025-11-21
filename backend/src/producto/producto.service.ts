import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import { Producto } from '../entities/producto.entity';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepo: Repository<Producto>,
  ) {}

  private calcularPrecioFinal(
    precio_base: number,
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
      if (descuento_porcentaje > 100) {
        throw new Error('El descuento porcentual no puede ser mayor al 100%');
      }
      return Math.round(precio_base * (1 - descuento_porcentaje / 100));
    }

    if (descuento_fijo) {
      if (descuento_fijo > precio_base) {
        throw new Error('El descuento fijo no puede ser mayor al precio base');
      }
      return precio_base - descuento_fijo;
    }

    return precio_base;
  }

  create(data: Partial<Producto>): Promise<Producto> {
    if (data.precio_base === undefined) {
      throw new Error('precio base es obligatorio');
    }

    const precio_final = this.calcularPrecioFinal(
      data.precio_base,
      data.descuento_porcentaje,
      data.descuento_fijo,
    );

    const producto = this.productoRepo.create({ ...data, precio_final });
    return this.productoRepo.save(producto);
  }

  findAll(nombre?: string): Promise<Producto[]> {
    const where = nombre ? { nombre: ILike(`%${nombre}%`) } : {};
    return this.productoRepo.find({
      where,
      relations: ['juegos'],
    });
  }

  findOne(id: number): Promise<Producto | null> {
    return this.productoRepo.findOne({
      where: { id },
      relations: ['juegos'],
    });
  }

  async update(id: number, data: Partial<Producto>): Promise<Producto> {
    if (data.precio_base !== undefined) {
      data.precio_final = this.calcularPrecioFinal(
        data.precio_base,
        data.descuento_porcentaje,
        data.descuento_fijo,
      );
    }

    const result = await this.productoRepo.update(id, data);
    if (result.affected === 0) {
      throw new Error(`Producto con id ${id} no encontrado`);
    }
    return this.findOne(id) as Promise<Producto>;
  }

  async modificarOferta(
    id: number,
    descuentos: { descuento_porcentaje?: number; descuento_fijo?: number },
  ): Promise<Producto> {
    const producto = await this.findOne(id);
    if (!producto) throw new Error(`Producto con id ${id} no encontrado`);

    producto.descuento_porcentaje = descuentos.descuento_porcentaje;
    producto.descuento_fijo = descuentos.descuento_fijo;
    producto.precio_final = this.calcularPrecioFinal(
      producto.precio_base,
      producto.descuento_porcentaje,
      producto.descuento_fijo,
    );

    return this.productoRepo.save(producto);
  }

  async remove(id: number): Promise<void> {
    const result = await this.productoRepo.delete(id);
    if (result.affected === 0) {
      throw new Error(`Producto con id ${id} no encontrado`);
    }
  }
  async findOfertas(): Promise<Producto[]> {
    return this.productoRepo.find({
      where: [
        { descuento_porcentaje: Not(IsNull()) },
        { descuento_fijo: Not(IsNull()) },
      ],
      relations: ['juegos'],
    });
  }
}
