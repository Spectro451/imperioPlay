import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Juego } from '../entities/juego.entity';
import { Producto } from 'src/entities/producto.entity';
import { Plataforma, estadoJuego } from 'src/entities/enums';
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

  findAll(): Promise<Juego[]> {
    return this.juegoRepo.find({
      where: { isActive: true },
      relations: ['producto'],
    });
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
