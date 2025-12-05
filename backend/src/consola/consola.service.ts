import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from '../entities/producto.entity';
import { Consolas } from 'src/entities/consola';
import { Consola, estadoJuego } from 'src/entities/enums';

@Injectable()
export class ConsolaService {
  constructor(
    @InjectRepository(Consolas)
    private readonly consolaRepo: Repository<Consolas>,
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
        throw new BadRequestException(
          'El descuento porcentual no puede ser mayor al 100%',
        );
      }
      return Math.round(precio_base * (1 - descuento_porcentaje / 100));
    }

    if (descuento_fijo) {
      if (descuento_fijo > precio_base) {
        throw new BadRequestException(
          'El descuento fijo no puede ser mayor al precio base',
        );
      }
      return precio_base - descuento_fijo;
    }

    return precio_base;
  }

  async restarStockConsola(
    consola: Consolas,
    cantidad: number,
  ): Promise<Consolas> {
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
  ): Promise<Consolas> {
    const consola = await this.findOne(id);
    if (!consola) throw new Error(`Consola con id ${id} no encontrada`);
    Object.assign(consola, descuentos);
    if (consola.descuento_porcentaje) consola.descuento_fijo = 0;
    if (consola.descuento_fijo) consola.descuento_porcentaje = 0;
    consola.precio_final = this.calcularPrecioFinal(
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
      generacion?: Consola;
      stock?: number;
      fotos?: string[];
      precio_base: number;
      descuento_porcentaje?: number;
      descuento_fijo?: number;
    },
  ): Promise<Consolas> {
    const estado = dataConsolaCliente.estado ?? estadoJuego.usado;
    const generacion = dataConsolaCliente.generacion ?? Consola.Ps3;
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

    const precio_final = this.calcularPrecioFinal(
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

  create(data: Partial<Consolas>): Promise<Consolas> {
    const consola = this.consolaRepo.create(data);
    return this.consolaRepo.save(consola);
  }

  findAll(): Promise<Consolas[]> {
    return this.consolaRepo.find({ relations: ['producto'] });
  }

  findOne(id: number): Promise<Consolas | null> {
    return this.consolaRepo.findOne({ where: { id }, relations: ['producto'] });
  }

  async update(id: number, data: Partial<Consolas>): Promise<Consolas> {
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
      consola.precio_final = this.calcularPrecioFinal(
        consola.precio_base,
        consola.descuento_porcentaje,
        consola.descuento_fijo,
      );
    }
    return this.consolaRepo.save(consola);
  }

  async remove(id: number): Promise<void> {
    const result = await this.consolaRepo.delete(id);
    if (result.affected === 0)
      throw new Error(`Consola con id ${id} no encontrada`);
  }
}
