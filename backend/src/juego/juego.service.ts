import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Juego } from '../entities/juego.entity';
import { Producto } from 'src/entities/producto.entity';
import { Consola, estadoJuego } from 'src/entities/enums';
import { VALOR_TIER } from 'src/constants/tiers.constant';

@Injectable()
export class JuegoService {
  constructor(
    @InjectRepository(Juego)
    private readonly juegoRepo: Repository<Juego>,
  ) {}

  calcularTier(precioFinal: number): number {
    const tiers = Object.entries(VALOR_TIER)
      .map(([tier, valor]) => ({ tier: Number(tier), valor }))
      .sort((a, b) => a.valor - b.valor);

    for (const t of tiers) {
      if (precioFinal <= t.valor) return t.tier;
    }

    return tiers[tiers.length - 1].tier;
  }

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

  async restarStockJuego(juego: Juego, cantidad: number): Promise<Juego> {
    if (juego.stock < cantidad) {
      throw new Error(
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

    juego.precio_final = this.calcularPrecioFinal(
      juego.precio_base,
      juego.descuento_porcentaje,
      juego.descuento_fijo,
    );

    juego.tier = this.calcularTier(juego.precio_final);

    return this.juegoRepo.save(juego);
  }

  async crearJuegoSiNoExiste(
    producto: Producto,
    dataJuegoCliente: {
      consola: Consola;
      estado?: estadoJuego;
      stock?: number;
      cantidad?: number;
      fotos?: string[];
      precio_base: number;
      descuento_porcentaje?: number;
      descuento_fijo?: number;
    },
  ): Promise<Juego> {
    const estado = dataJuegoCliente.estado ?? estadoJuego.usado;
    const cantidad = dataJuegoCliente.cantidad ?? dataJuegoCliente.stock ?? 1;

    const juegoExistente = producto.juegos.find(
      (j) => j.consola === dataJuegoCliente.consola && j.estado === estado,
    );

    if (juegoExistente) {
      juegoExistente.stock += cantidad;
      return this.juegoRepo.save(juegoExistente);
    }

    if (dataJuegoCliente.descuento_porcentaje)
      dataJuegoCliente.descuento_fijo = 0;
    if (dataJuegoCliente.descuento_fijo)
      dataJuegoCliente.descuento_porcentaje = 0;

    const precio_final = this.calcularPrecioFinal(
      dataJuegoCliente.precio_base,
      dataJuegoCliente.descuento_porcentaje,
      dataJuegoCliente.descuento_fijo,
    );
    const nuevoJuego = this.juegoRepo.create({
      producto,
      consola: dataJuegoCliente.consola,
      precio_base: dataJuegoCliente.precio_base,
      estado,
      stock: cantidad,
      precio_final,
      tier: this.calcularTier(precio_final),
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

  findAll(): Promise<Juego[]> {
    return this.juegoRepo.find({
      relations: ['producto', 'intercambioJuegos'],
    });
  }

  findOne(id: number): Promise<Juego | null> {
    return this.juegoRepo.findOne({
      where: { id },
      relations: ['producto', 'intercambioJuegos'],
    });
  }

  async update(id: number, data: Partial<Juego>): Promise<Juego> {
    const juego = await this.findOne(id);
    if (!juego) throw new NotFoundException(`Juego con id ${id} no encontrado`);

    const originalConsola = juego.consola;
    const originalEstado = juego.estado;

    Object.assign(juego, data);

    if (
      data.descuento_porcentaje !== undefined ||
      data.descuento_fijo !== undefined
    ) {
      if (juego.descuento_porcentaje) juego.descuento_fijo = 0;
      if (juego.descuento_fijo) juego.descuento_porcentaje = 0;

      juego.precio_final = this.calcularPrecioFinal(
        juego.precio_base,
        juego.descuento_porcentaje,
        juego.descuento_fijo,
      );
      juego.tier = this.calcularTier(juego.precio_final);
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
    const result = await this.juegoRepo.delete(id);
    if (result.affected === 0) {
      throw new Error(`Juego con id ${id} no encontrado`);
    }
  }
}
