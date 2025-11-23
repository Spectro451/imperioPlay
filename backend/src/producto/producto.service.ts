import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { And, ILike, IsNull, MoreThan, Not, Repository } from 'typeorm';
import { Producto } from '../entities/producto.entity';
import { tipoProducto } from 'src/entities/enums';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepo: Repository<Producto>,
  ) {}

  //funcion para recalcular el precio final del producto en base a que descuento tiene
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

  //crear producto y asignarle precio final
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

  //buscar por nombre
  async findAll(filtro?: {
    nombre?: string;
    tipo?: tipoProducto;
    page?: number;
  }) {
    const where: any = {};
    if (filtro?.nombre) where.nombre = ILike(`%${filtro.nombre}%`);
    if (filtro?.tipo) where.tipo = filtro.tipo;

    const page = filtro?.page || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const [productos, total] = await this.productoRepo.findAndCount({
      where,
      relations: ['juegos'],
      take: limit,
      skip,
    });
    const totalPaginas = Math.ceil(total / limit);

    return { productos, total, totalPaginas };
  }

  //llamar a 1 producto por id y relacion
  findOne(id: number): Promise<Producto | null> {
    return this.productoRepo.findOne({
      where: { id },
      relations: ['juegos'],
    });
  }

  //actualizar y recalcular precio
  async update(id: number, data: Partial<Producto>): Promise<Producto> {
    const producto = await this.findOne(id);
    if (!producto) throw new Error(`Producto con id ${id} no encontrado`);

    const { descuento_porcentaje, descuento_fijo, ...restoDatos } = data;

    if (restoDatos.precio_base !== undefined) {
      producto.precio_base = restoDatos.precio_base;
      producto.precio_final = producto.precio_base;
    }

    Object.assign(producto, restoDatos);
    return this.productoRepo.save(producto);
  }

  //cambiar solo oferta y recalcular precio
  async modificarOferta(
    id: number,
    descuentos: { descuento_porcentaje?: number; descuento_fijo?: number },
  ): Promise<Producto> {
    const producto = await this.findOne(id);
    if (!producto) throw new Error(`Producto con id ${id} no encontrado`);

    producto.descuento_porcentaje = descuentos.descuento_porcentaje ?? 0;
    producto.descuento_fijo = descuentos.descuento_fijo ?? 0;

    if (producto.descuento_porcentaje) producto.descuento_fijo = 0;
    if (producto.descuento_fijo) producto.descuento_porcentaje = 0;

    producto.precio_final = this.calcularPrecioFinal(
      producto.precio_base,
      producto.descuento_porcentaje,
      producto.descuento_fijo,
    );

    return this.productoRepo.save(producto);
  }

  //borrar producto
  async remove(id: number): Promise<void> {
    const result = await this.productoRepo.delete(id);
    if (result.affected === 0) {
      throw new Error(`Producto con id ${id} no encontrado`);
    }
  }

  //llamar solo las ofertas
  async findOfertas(filtro?: {
    nombre?: string;
    tipo?: tipoProducto;
    page?: number;
  }) {
    const baseWhere: any[] = [
      { descuento_porcentaje: And(Not(IsNull()), MoreThan(0)) },
      { descuento_fijo: And(Not(IsNull()), MoreThan(0)) },
    ];

    if (filtro?.nombre) {
      baseWhere.forEach((w) => (w.nombre = ILike(`%${filtro.nombre}%`)));
    }

    if (filtro?.tipo) {
      baseWhere.forEach((w) => (w.tipo = filtro.tipo));
    }

    const page = filtro?.page || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const [productos, total] = await this.productoRepo.findAndCount({
      where: baseWhere,
      relations: ['juegos'],
      take: limit,
      skip,
    });

    const totalPaginas = Math.ceil(total / limit);

    return { productos, total, totalPaginas };
  }
  async crearProductoSiNoExiste(data: Partial<Producto>): Promise<Producto> {
    const existing = await this.productoRepo.findOne({
      where: { nombre: data.nombre },
      relations: ['juegos'],
    });
    if (existing) {
      return existing;
    }
    return this.create(data);
  }
}
