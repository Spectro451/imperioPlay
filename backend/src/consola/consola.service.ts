import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from '../entities/producto.entity';
import { Consola } from 'src/entities/consola';
import { Plataforma, estadoJuego } from 'src/entities/enums';
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

  findAll(): Promise<Consola[]> {
    return this.consolaRepo.find({
      where: { isActive: true },
      relations: ['producto'],
    });
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
