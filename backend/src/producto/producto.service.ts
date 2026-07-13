import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { And, ILike, IsNull, MoreThan, Not, Repository, DataSource } from 'typeorm';
import { Producto } from '../entities/producto.entity';
import { Plataforma, estadoJuego, Orden, tipoProducto } from 'src/entities/enums';
import { ORDER_MAP } from 'src/constants/orden';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepo: Repository<Producto>,
    private readonly dataSource: DataSource,
  ) {}

  create(data: Partial<Producto>): Promise<Producto> {
    const producto = this.productoRepo.create(data);
    return this.productoRepo.save(producto);
  }

  async findAll(filtro?: {
    nombre?: string;
    tipo?: tipoProducto;
    page?: number;
    consola?: Plataforma;
    orden?: Orden;
    estado?: estadoJuego;
    sku?: string;
    activo?: 'true' | 'false' | 'todos';
  }) {
    const page = filtro?.page || 1;
    const limit = 20;
    const skip = (page - 1) * limit;
    const activo = filtro?.activo ?? 'true';

    const query = this.productoRepo
      .createQueryBuilder('producto')
      .leftJoinAndSelect('producto.juegos', 'juego')
      .leftJoinAndSelect('producto.consolas', 'consola');

    if (activo === 'true') query.andWhere('producto.isActive = true');
    else if (activo === 'false') query.andWhere('producto.isActive = false');

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

    const ordenKey = filtro?.orden || Orden.ID_DESC;
    if (ordenKey === Orden.PRECIO_ASC || ordenKey === Orden.PRECIO_DESC) {
      const dir = ordenKey === Orden.PRECIO_ASC ? 'ASC' : 'DESC';
      query.orderBy('COALESCE(juego.precio_final, consola.precio_final)', dir);
    } else {
      const [campo, direccion] = ORDER_MAP[ordenKey];
      query.orderBy(campo, direccion);
    }

    const [productos, total] = await query.getManyAndCount();
    const totalPaginas = Math.ceil(total / limit);

    return { productos, total, totalPaginas };
  }

  findOne(id: number): Promise<Producto | null> {
    return this.productoRepo.findOne({
      where: { id },
      relations: ['juegos', 'consolas'],
    });
  }

  async update(id: number, data: Partial<Producto>): Promise<Producto> {
    const producto = await this.findOne(id);
    if (!producto) throw new Error(`Producto con id ${id} no encontrado`);

    Object.assign(producto, data);

    return await this.productoRepo.save(producto);
  }

  async remove(id: number): Promise<void> {
    const producto = await this.findOne(id);
    if (!producto)
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    if (!producto.isActive)
      throw new BadRequestException(`Producto con id ${id} ya está inactivo`);
    producto.isActive = false;
    await this.productoRepo.save(producto);
  }

  async reactivarSiInactivo(id: number): Promise<void> {
    const producto = await this.findOne(id);
    if (!producto)
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    if (producto.isActive) return;
    producto.isActive = true;
    await this.productoRepo.save(producto);
  }

  async findOfertas(filtro?: {
    nombre?: string;
    tipo?: tipoProducto;
    page?: number;
    consola?: Plataforma;
    orden?: Orden;
    estado?: estadoJuego;
    sku?: string;
  }) {
    const page = filtro?.page || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const query = this.productoRepo
      .createQueryBuilder('producto')
      .leftJoinAndSelect('producto.juegos', 'juego')
      .leftJoinAndSelect('producto.consolas', 'consola')
      .where('producto.isActive = :isActive', { isActive: true })
      .andWhere(
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

    const ordenKey = filtro?.orden || Orden.ID_DESC;
    if (ordenKey === Orden.PRECIO_ASC || ordenKey === Orden.PRECIO_DESC) {
      const dir = ordenKey === Orden.PRECIO_ASC ? 'ASC' : 'DESC';
      query.orderBy('COALESCE(juego.precio_final, consola.precio_final)', dir);
    } else {
      const [campo, direccion] = ORDER_MAP[ordenKey];
      query.orderBy(campo, direccion);
    }

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
      if (!existing.isActive) {
        existing.isActive = true;
        await this.productoRepo.save(existing);
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

  async findVariantes(filtro?: {
    nombre?: string;
    sku?: string;
    tipo?: tipoProducto;
    consola?: Plataforma;
    estado?: estadoJuego;
    orden?: Orden;
    page?: number;
    oferta?: boolean;
    conStock?: boolean;
    activo?: 'true' | 'false' | 'todos';
  }) {
    const limit = 20;
    const offset = ((filtro?.page || 1) - 1) * limit;
    const params: any[] = [];
    let pi = 1;
    const activo = filtro?.activo ?? 'true';

    const nombreCond = filtro?.nombre
      ? `AND p.nombre ILIKE $${(() => { params.push(`%${filtro.nombre}%`); return pi++; })()}`
      : '';
    const skuCond = filtro?.sku
      ? `AND p.sku ILIKE $${(() => { params.push(`%${filtro.sku}%`); return pi++; })()}`
      : '';
    const estadoCond = filtro?.estado
      ? `AND estado::text = $${(() => { params.push(filtro.estado); return pi++; })()}`
      : '';
    let consolaJuegoCond = '';
    let consolaConsolaCond = '';
    if (filtro?.consola) {
      const idx = pi++;
      params.push(filtro.consola);
      consolaJuegoCond = `AND j.consola::text = $${idx}`;
      consolaConsolaCond = `AND c.generacion::text = $${idx}`;
    }
    const ofertaCond = filtro?.oferta
      ? `AND (descuento_porcentaje > 0 OR descuento_fijo > 0)`
      : '';
    const stockCond = filtro?.conStock ? `AND stock > 0` : '';

    const activoJuegoCond =
      activo === 'true'
        ? `AND j."isActive" = true AND p."isActive" = true`
        : activo === 'false'
          ? `AND (j."isActive" = false OR p."isActive" = false)`
          : '';
    const activoConsolaCond =
      activo === 'true'
        ? `AND c."isActive" = true AND p."isActive" = true`
        : activo === 'false'
          ? `AND (c."isActive" = false OR p."isActive" = false)`
          : '';

    const ORDEN_MAP: Record<string, string> = {
      [Orden.ID]: 'id ASC',
      [Orden.ID_DESC]: 'id DESC',
      [Orden.ABC]: 'nombre ASC',
      [Orden.ABC_DESC]: 'nombre DESC',
      [Orden.PRECIO_ASC]: 'precio_final ASC',
      [Orden.PRECIO_DESC]: 'precio_final DESC',
      [Orden.STOCK_ASC]: 'stock ASC',
      [Orden.STOCK_DESC]: 'stock DESC',
    };
    const orderClause = ORDEN_MAP[filtro?.orden ?? Orden.ID_DESC] ?? 'id DESC';

    const branches: string[] = [];

    if (!filtro?.tipo || filtro.tipo === tipoProducto.juego) {
      branches.push(`
        SELECT j.id, p.nombre, p.sku, p.tipo::text AS tipo, j.consola::text AS plataforma,
               j.estado::text AS variante_estado, j.precio_base, j.precio_final,
               j.descuento_porcentaje, j.descuento_fijo, j.fotos, j.stock,
               (j."isActive" AND p."isActive") AS "isActive"
        FROM juego j
        INNER JOIN producto p ON j."productoId" = p.id
        WHERE 1=1 ${activoJuegoCond} ${nombreCond} ${skuCond} ${estadoCond} ${consolaJuegoCond} ${ofertaCond} ${stockCond}
      `);
    }

    if (!filtro?.tipo || filtro.tipo === tipoProducto.consola) {
      branches.push(`
        SELECT c.id, p.nombre, p.sku, p.tipo::text AS tipo, c.generacion::text AS plataforma,
               c.estado::text AS variante_estado, c.precio_base, c.precio_final,
               c.descuento_porcentaje, c.descuento_fijo, c.fotos, c.stock,
               (c."isActive" AND p."isActive") AS "isActive"
        FROM consolas c
        INNER JOIN producto p ON c."productoId" = p.id
        WHERE 1=1 ${activoConsolaCond} ${nombreCond} ${skuCond} ${estadoCond} ${consolaConsolaCond} ${ofertaCond} ${stockCond}
      `);
    }

    const union = branches.join(' UNION ALL ');

    const [variantes, countResult] = await Promise.all([
      this.dataSource.query(
        `SELECT * FROM (${union}) AS v ORDER BY ${orderClause} LIMIT ${limit} OFFSET ${offset}`,
        params,
      ),
      this.dataSource.query(`SELECT COUNT(*)::int AS total FROM (${union}) AS v`, params),
    ]);

    const total: number = countResult[0]?.total ?? 0;
    return { variantes, totalPaginas: Math.ceil(total / limit) };
  }

  async findBySku(sku: string): Promise<Producto | null> {
    return this.productoRepo.findOne({
      where: { sku },
      relations: ['juegos', 'consolas'],
    });
  }
}
