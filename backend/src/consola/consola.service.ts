import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from '../entities/producto.entity';
import { Consola } from 'src/entities/consola';
import { Plataforma, estadoJuego, Orden } from 'src/entities/enums';
import { calcularPrecioFinal } from 'src/utils/pricing';

@Injectable()
export class ConsolaService {
  constructor(
    @InjectRepository(Consola)
    private readonly consolaRepo: Repository<Consola>,
  ) {}

  async restarStockConsola(
    consola: Consola,
    cantidad: number,
  ): Promise<Consola> {
    if (consola.stock < cantidad) {
      throw new BadRequestException(
        `No hay suficiente stock para la consola ${consola.id}. Stock disponible: ${consola.stock}`,
      );
    }
    consola.stock -= cantidad;
    return this.consolaRepo.save(consola);
  }

  async modificarOferta(
    id: number,
    descuentos: { descuento_porcentaje?: number; descuento_fijo?: number },
  ): Promise<Consola> {
    const consola = await this.findOne(id);
    if (!consola) throw new Error(`Consola con id ${id} no encontrada`);
    Object.assign(consola, descuentos);
    if (consola.descuento_porcentaje) consola.descuento_fijo = 0;
    if (consola.descuento_fijo) consola.descuento_porcentaje = 0;
    consola.precio_final = calcularPrecioFinal(
      consola.precio_base,
      consola.descuento_porcentaje,
      consola.descuento_fijo,
    );
    return this.consolaRepo.save(consola);
  }

  async crearConsolaSiNoExiste(
    producto: Producto,
    dataConsolaCliente: {
      estado?: estadoJuego;
      generacion?: Plataforma;
      stock?: number;
      fotos?: string[];
      precio_base: number;
      descuento_porcentaje?: number;
      descuento_fijo?: number;
    },
  ): Promise<Consola> {
    const estado = dataConsolaCliente.estado ?? estadoJuego.usado;
    const generacion = dataConsolaCliente.generacion ?? Plataforma.Ps3;
    const stock = dataConsolaCliente.stock ?? 1;
    const consolas = producto.consolas ?? [];

    const consolaExistente = consolas.find((c) => c.estado === estado);

    if (consolaExistente) {
      consolaExistente.stock += stock;
      return this.consolaRepo.save(consolaExistente);
    }

    if (dataConsolaCliente.descuento_porcentaje)
      dataConsolaCliente.descuento_fijo = 0;
    if (dataConsolaCliente.descuento_fijo)
      dataConsolaCliente.descuento_porcentaje = 0;

    const precio_final = calcularPrecioFinal(
      dataConsolaCliente.precio_base,
      dataConsolaCliente.descuento_porcentaje,
      dataConsolaCliente.descuento_fijo,
    );

    const nuevaConsola = this.consolaRepo.create({
      producto,
      estado,
      generacion,
      precio_base: dataConsolaCliente.precio_base,
      stock,
      precio_final,
      fotos: dataConsolaCliente.fotos || [],
      descuento_porcentaje: dataConsolaCliente.descuento_porcentaje,
      descuento_fijo: dataConsolaCliente.descuento_fijo,
    });

    return this.consolaRepo.save(nuevaConsola);
  }

  create(data: Partial<Consola>): Promise<Consola> {
    const consola = this.consolaRepo.create(data);
    return this.consolaRepo.save(consola);
  }

  async findAll(filtro?: {
    nombre?: string;
    consola?: Plataforma;
    estado?: estadoJuego;
    orden?: Orden;
    page?: number;
    limit?: number;
  }): Promise<{ consolas: Consola[]; totalPaginas: number }> {
    const page = filtro?.page || 1;
    const limit = filtro?.limit || 20;
    const skip = (page - 1) * limit;

    const query = this.consolaRepo
      .createQueryBuilder('consola')
      .leftJoinAndSelect('consola.producto', 'producto')
      .where('producto.isActive = true');

    if (filtro?.nombre)
      query.andWhere('producto.nombre ILIKE :nombre', { nombre: `%${filtro.nombre}%` });
    if (filtro?.consola)
      query.andWhere('consola.generacion = :consola', { consola: filtro.consola });
    if (filtro?.estado)
      query.andWhere('consola.estado = :estado', { estado: filtro.estado });

    const ordenKey = filtro?.orden || Orden.ID_DESC;
    if (ordenKey === Orden.PRECIO_ASC) query.orderBy('consola.precio_final', 'ASC');
    else if (ordenKey === Orden.PRECIO_DESC) query.orderBy('consola.precio_final', 'DESC');
    else if (ordenKey === Orden.ABC) query.orderBy('producto.nombre', 'ASC');
    else if (ordenKey === Orden.ABC_DESC) query.orderBy('producto.nombre', 'DESC');
    else if (ordenKey === Orden.ID) query.orderBy('consola.id', 'ASC');
    else query.orderBy('consola.id', 'DESC');

    query.take(limit).skip(skip);

    const [consolas, total] = await query.getManyAndCount();
    return { consolas, totalPaginas: Math.ceil(total / limit) };
  }

  findOne(id: number): Promise<Consola | null> {
    return this.consolaRepo.findOne({ where: { id }, relations: ['producto'] });
  }

  async update(id: number, data: Partial<Consola>): Promise<Consola> {
    const consola = await this.findOne(id);
    if (!consola)
      throw new NotFoundException(`Consola con id ${id} no encontrada`);
    Object.assign(consola, data);
    if (
      data.descuento_porcentaje !== undefined ||
      data.descuento_fijo !== undefined
    ) {
      if (consola.descuento_porcentaje) consola.descuento_fijo = 0;
      if (consola.descuento_fijo) consola.descuento_porcentaje = 0;
      consola.precio_final = calcularPrecioFinal(
        consola.precio_base,
        consola.descuento_porcentaje,
        consola.descuento_fijo,
      );
    }
    return this.consolaRepo.save(consola);
  }

  async remove(id: number): Promise<void> {
    const consola = await this.findOne(id);
    if (!consola)
      throw new NotFoundException(`Consola con id ${id} no encontrada`);
    if (!consola.isActive)
      throw new BadRequestException(`Consola con id ${id} ya está inactiva`);
    consola.isActive = false;
    await this.consolaRepo.save(consola);
  }
}
