import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { And, ILike, IsNull, MoreThan, Not, Repository } from 'typeorm';
import { Producto } from '../entities/producto.entity';
import { Consola, tipoProducto } from 'src/entities/enums';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepo: Repository<Producto>,
  ) {}

  //crear producto
  create(data: Partial<Producto>): Promise<Producto> {
    const producto = this.productoRepo.create(data);
    return this.productoRepo.save(producto);
  }

  //buscar por nombre
  async findAll(filtro?: {
    nombre?: string;
    tipo?: tipoProducto;
    page?: number;
    consola?: Consola;
    orden?: 'id' | 'abc';
  }) {
    const page = filtro?.page || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const query = this.productoRepo
      .createQueryBuilder('producto')
      .leftJoinAndSelect('producto.juegos', 'juego');

    if (filtro?.nombre)
      query.andWhere('producto.nombre ILIKE :nombre', {
        nombre: `%${filtro.nombre}%`,
      });

    if (filtro?.tipo)
      query.andWhere('producto.tipo = :tipo', { tipo: filtro.tipo });

    if (filtro?.consola)
      query.andWhere('juego.consola = :consola', { consola: filtro.consola });

    query.take(limit).skip(skip);

    query.orderBy(
      filtro?.orden === 'abc' ? 'producto.nombre' : 'producto.id',
      'ASC',
    );

    const [productos, total] = await query.getManyAndCount();
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

    Object.assign(producto, data);

    return await this.productoRepo.save(producto);
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
    consola?: Consola;
    orden?: 'id' | 'abc';
  }) {
    const page = filtro?.page || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const query = this.productoRepo
      .createQueryBuilder('producto')
      .leftJoinAndSelect('producto.juegos', 'juego')
      .where('(juego.descuento_porcentaje > 0 OR juego.descuento_fijo > 0)');

    if (filtro?.nombre)
      query.andWhere('producto.nombre ILIKE :nombre', {
        nombre: `%${filtro.nombre}%`,
      });

    if (filtro?.tipo)
      query.andWhere('producto.tipo = :tipo', { tipo: filtro.tipo });

    if (filtro?.consola)
      query.andWhere('juego.consola = :consola', { consola: filtro.consola });

    query
      .take(limit)
      .skip(skip)
      .orderBy(
        filtro?.orden === 'abc' ? 'producto.nombre' : 'producto.id',
        'ASC',
      );

    const [productos, total] = await query.getManyAndCount();
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
