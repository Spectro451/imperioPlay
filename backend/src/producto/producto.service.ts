import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { And, ILike, IsNull, MoreThan, Not, Repository } from 'typeorm';
import { Producto } from '../entities/producto.entity';
import { Consola, estadoJuego, Orden, tipoProducto } from 'src/entities/enums';
import { ORDER_MAP } from 'src/constants/orden';

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
    orden?: Orden;
    estado?: estadoJuego;
    sku?: string;
  }) {
    const page = filtro?.page || 1;
    const limit = 18;
    const skip = (page - 1) * limit;

    const query = this.productoRepo
      .createQueryBuilder('producto')
      .leftJoinAndSelect('producto.juegos', 'juego')
      .leftJoinAndSelect('producto.consolas', 'consola');

    if (filtro?.nombre)
      query.andWhere('producto.nombre ILIKE :nombre', {
        nombre: `%${filtro.nombre}%`,
      });

    if (filtro?.tipo)
      query.andWhere('producto.tipo = :tipo', { tipo: filtro.tipo });

    if (filtro?.estado) {
      query.andWhere(
        `(juego.estado::text = :estado OR consola.estado::text = :estado)`,
        { estado: filtro.estado },
      );
    }

    if (filtro?.consola) {
      if (!filtro.tipo || filtro.tipo === tipoProducto.juego) {
        query.andWhere('juego.consola = :consola', { consola: filtro.consola });
      } else if (filtro.tipo === tipoProducto.consola) {
        query.andWhere('consola.generacion = :consola', {
          consola: filtro.consola,
        });
      }
    }

    if (filtro?.sku)
      query.andWhere('producto.sku = :sku', {
        sku: filtro.sku,
      });

    query.take(limit).skip(skip);

    const ordenKey = filtro?.orden || Orden.ID;
    const [campo, direccion] = ORDER_MAP[ordenKey];
    query.orderBy(campo, direccion);

    const [productos, total] = await query.getManyAndCount();
    const totalPaginas = Math.ceil(total / limit);

    return { productos, total, totalPaginas };
  }

  //llamar a 1 producto por id y relacion
  findOne(id: number): Promise<Producto | null> {
    return this.productoRepo.findOne({
      where: { id },
      relations: ['juegos', 'consolas'],
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
    orden?: Orden;
    estado?: estadoJuego;
    sku?: string;
  }) {
    const page = filtro?.page || 1;
    const limit = 18;
    const skip = (page - 1) * limit;

    const query = this.productoRepo
      .createQueryBuilder('producto')
      .leftJoinAndSelect('producto.juegos', 'juego')
      .leftJoinAndSelect('producto.consolas', 'consola')
      .where(
        '(juego.descuento_porcentaje > 0 OR juego.descuento_fijo > 0 OR consola.descuento_porcentaje > 0 OR consola.descuento_fijo > 0)',
      );

    if (filtro?.nombre)
      query.andWhere('producto.nombre ILIKE :nombre', {
        nombre: `%${filtro.nombre}%`,
      });

    if (filtro?.tipo)
      query.andWhere('producto.tipo = :tipo', { tipo: filtro.tipo });

    if (filtro?.estado) {
      query.andWhere(
        `(juego.estado::text = :estado OR consola.estado::text = :estado)`,
        { estado: filtro.estado },
      );
    }

    if (filtro?.consola) {
      if (!filtro.tipo || filtro.tipo === tipoProducto.juego) {
        query.andWhere('juego.consola = :consola', { consola: filtro.consola });
      } else if (filtro.tipo === tipoProducto.consola) {
        query.andWhere('consola.generacion = :consola', {
          consola: filtro.consola,
        });
      }
    }

    if (filtro?.sku) query.andWhere('producto.sku = :sku', { sku: filtro.sku });

    query.take(limit).skip(skip);

    const ordenKey = filtro?.orden || Orden.ID;
    const [campo, direccion] = ORDER_MAP[ordenKey];
    query.orderBy(campo, direccion);

    const [productos, total] = await query.getManyAndCount();
    const totalPaginas = Math.ceil(total / limit);

    return { productos, total, totalPaginas };
  }

  async crearProductoSiNoExiste(data: Partial<Producto>): Promise<Producto> {
    const existing = await this.productoRepo.findOne({
      where: { sku: data.sku },
      relations: ['juegos', 'consolas'],
    });
    if (existing) {
      if (existing.tipo !== data.tipo) {
        throw new BadRequestException(
          `SKU "${data.sku}" ya está registrado para un producto tipo "${existing.tipo}" (nombre: "${existing.nombre}"). No puede usarse para tipo "${data.tipo}".`,
        );
      }
      return existing;
    }

    const producto = this.productoRepo.create(data);
    return this.productoRepo.save(producto);
  }

  async getNombres(busqueda?: string): Promise<string[]> {
    const query = this.productoRepo
      .createQueryBuilder('producto')
      .select('producto.nombre')
      .distinct(true);

    if (busqueda) {
      query.where('LOWER(producto.nombre) LIKE LOWER(:busqueda)', {
        busqueda: `%${busqueda}%`,
      });
    }

    query.orderBy('producto.nombre', 'ASC');

    const productos = await query.getRawMany();
    return productos.map((p) => p.producto_nombre);
  }

  async findBySku(sku: string): Promise<Producto | null> {
    return this.productoRepo.findOne({
      where: { sku },
      relations: ['juegos', 'consolas'],
    });
  }
}
