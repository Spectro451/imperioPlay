import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Juego } from '../entities/juego.entity';
import { Producto } from 'src/entities/producto.entity';
import { Plataforma, estadoJuego, Orden } from 'src/entities/enums';
import { calcularPrecioFinal, calcularTier } from 'src/utils/pricing';

@Injectable()
export class JuegoService {
  constructor(
    @InjectRepository(Juego)
    private readonly juegoRepo: Repository<Juego>,
  ) {}

  async restarStockJuego(juego: Juego, cantidad: number): Promise<Juego> {
    if (juego.stock < cantidad) {
      throw new BadRequestException(
        `No hay suficiente stock para el juego ${juego.id}. Stock disponible: ${juego.stock}`,
      );
    }
    juego.stock -= cantidad;
    return this.juegoRepo.save(juego);
  }

  async modificarOferta(
    id: number,
    descuentos: { descuento_porcentaje?: number; descuento_fijo?: number },
  ): Promise<Juego> {
    const juego = await this.findOne(id);
    if (!juego) throw new Error(`Juego con id ${id} no encontrado`);

    Object.assign(juego, descuentos);

    if (juego.descuento_porcentaje) juego.descuento_fijo = 0;
    if (juego.descuento_fijo) juego.descuento_porcentaje = 0;

    juego.precio_final = calcularPrecioFinal(
      juego.precio_base,
      juego.descuento_porcentaje,
      juego.descuento_fijo,
    );
    juego.tier = calcularTier(juego.precio_final);

    return this.juegoRepo.save(juego);
  }

  async crearJuegoSiNoExiste(
    producto: Producto,
    dataJuegoCliente: {
      consola: Plataforma;
      estado?: estadoJuego;
      stock?: number;
      fotos?: string[];
      precio_base: number;
      descuento_porcentaje?: number;
      descuento_fijo?: number;
    },
  ): Promise<Juego> {
    const estado = dataJuegoCliente.estado ?? estadoJuego.usado;
    const stock = dataJuegoCliente.stock ?? 1;
    const juegos = producto.juegos ?? [];

    const juegoExistente = juegos.find(
      (j) => j.consola === dataJuegoCliente.consola && j.estado === estado,
    );

    if (juegoExistente) {
      juegoExistente.stock += stock;
      return this.juegoRepo.save(juegoExistente);
    }

    if (dataJuegoCliente.descuento_porcentaje)
      dataJuegoCliente.descuento_fijo = 0;
    if (dataJuegoCliente.descuento_fijo)
      dataJuegoCliente.descuento_porcentaje = 0;

    const precio_final = calcularPrecioFinal(
      dataJuegoCliente.precio_base,
      dataJuegoCliente.descuento_porcentaje,
      dataJuegoCliente.descuento_fijo,
    );

    const nuevoJuego = this.juegoRepo.create({
      producto,
      consola: dataJuegoCliente.consola,
      precio_base: dataJuegoCliente.precio_base,
      estado,
      stock,
      precio_final,
      tier: calcularTier(precio_final),
      fotos: dataJuegoCliente.fotos || [],
      descuento_porcentaje: dataJuegoCliente.descuento_porcentaje,
      descuento_fijo: dataJuegoCliente.descuento_fijo,
    });

    return this.juegoRepo.save(nuevoJuego);
  }

  create(data: Partial<Juego>): Promise<Juego> {
    const juego = this.juegoRepo.create(data);
    return this.juegoRepo.save(juego);
  }

  async findAll(filtro?: {
    nombre?: string;
    consola?: Plataforma;
    estado?: estadoJuego;
    orden?: Orden;
    page?: number;
    limit?: number;
  }): Promise<{ juegos: Juego[]; totalPaginas: number }> {
    const page = filtro?.page || 1;
    const limit = filtro?.limit || 20;
    const skip = (page - 1) * limit;

    const query = this.juegoRepo
      .createQueryBuilder('juego')
      .leftJoinAndSelect('juego.producto', 'producto')
      .where('juego.isActive = true')
      .andWhere('producto.isActive = true');

    if (filtro?.nombre)
      query.andWhere('producto.nombre ILIKE :nombre', { nombre: `%${filtro.nombre}%` });
    if (filtro?.consola)
      query.andWhere('juego.consola = :consola', { consola: filtro.consola });
    if (filtro?.estado)
      query.andWhere('juego.estado = :estado', { estado: filtro.estado });

    const ordenKey = filtro?.orden || Orden.ID_DESC;
    if (ordenKey === Orden.PRECIO_ASC) query.orderBy('juego.precio_final', 'ASC');
    else if (ordenKey === Orden.PRECIO_DESC) query.orderBy('juego.precio_final', 'DESC');
    else if (ordenKey === Orden.ABC) query.orderBy('producto.nombre', 'ASC');
    else if (ordenKey === Orden.ABC_DESC) query.orderBy('producto.nombre', 'DESC');
    else if (ordenKey === Orden.ID) query.orderBy('juego.id', 'ASC');
    else query.orderBy('juego.id', 'DESC');

    query.take(limit).skip(skip);

    const [juegos, total] = await query.getManyAndCount();
    return { juegos, totalPaginas: Math.ceil(total / limit) };
  }

  findOne(id: number): Promise<Juego | null> {
    return this.juegoRepo.findOne({
      where: { id },
      relations: ['producto'],
    });
  }

  async update(id: number, data: Partial<Juego>): Promise<Juego> {
    const juego = await this.findOne(id);
    if (!juego) throw new NotFoundException(`Juego con id ${id} no encontrado`);

    const originalConsola = juego.consola;
    const originalEstado = juego.estado;

    Object.assign(juego, data);

    if (
      data.precio_base !== undefined ||
      data.descuento_porcentaje !== undefined ||
      data.descuento_fijo !== undefined
    ) {
      if (juego.descuento_porcentaje) juego.descuento_fijo = 0;
      if (juego.descuento_fijo) juego.descuento_porcentaje = 0;

      juego.precio_final = calcularPrecioFinal(
        juego.precio_base,
        juego.descuento_porcentaje,
        juego.descuento_fijo,
      );
      juego.tier = calcularTier(juego.precio_final);
    }

    if (
      (data.estado && data.estado !== originalEstado) ||
      (data.consola && data.consola !== originalConsola)
    ) {
      const juegoExistente = await this.juegoRepo.findOne({
        where: {
          productoId: juego.productoId,
          consola: juego.consola,
          estado: juego.estado,
        },
      });

      if (juegoExistente && juegoExistente.id !== juego.id) {
        juegoExistente.stock += juego.stock;
        await this.juegoRepo.remove(juego);
        return this.juegoRepo.save(juegoExistente);
      }
    }

    return this.juegoRepo.save(juego);
  }

  async remove(id: number): Promise<void> {
    const juego = await this.findOne(id);
    if (!juego)
      throw new NotFoundException(`Juego con id ${id} no encontrado`);
    if (!juego.isActive)
      throw new BadRequestException(`Juego con id ${id} ya está inactivo`);
    juego.isActive = false;
    await this.juegoRepo.save(juego);
  }
}
