import { Injectable } from '@nestjs/common';
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

  async restarStockJuego(juego: Juego, cantidad: number): Promise<Juego> {
    if (juego.stock < cantidad) {
      throw new Error(
        `No hay suficiente stock para el juego ${juego.id}. Stock disponible: ${juego.stock}`,
      );
    }

    juego.stock -= cantidad;
    return this.juegoRepo.save(juego);
  }

  async crearJuegoUsadoSiNoExiste(
    producto: Producto,
    dataJuegoCliente: { consola: Consola; cantidad: number; fotos?: string[] },
  ): Promise<Juego> {
    const juegoExistente = producto.juegos.find(
      (j) => j.consola === dataJuegoCliente.consola && j.estado === 'usado',
    );

    if (juegoExistente) {
      juegoExistente.stock += dataJuegoCliente.cantidad;
      return this.juegoRepo.save(juegoExistente);
    }

    const nuevoJuego = this.juegoRepo.create({
      producto,
      consola: dataJuegoCliente.consola,
      estado: estadoJuego.usado,
      stock: dataJuegoCliente.cantidad,
      tier: this.calcularTier(producto.precio_final),
      fotos: dataJuegoCliente.fotos || [],
    });

    return this.juegoRepo.save(nuevoJuego);
  }

  create(data: Partial<Juego>): Promise<Juego> {
    const juego = this.juegoRepo.create(data);
    return this.juegoRepo.save(juego);
  }

  findAll(): Promise<Juego[]> {
    return this.juegoRepo.find({
      relations: ['producto', 'ventaJuegos', 'intercambioJuegos'],
    });
  }

  findOne(id: number): Promise<Juego | null> {
    return this.juegoRepo.findOne({
      where: { id },
      relations: ['producto', 'ventaJuegos', 'intercambioJuegos'],
    });
  }

  async update(id: number, data: Partial<Juego>): Promise<Juego> {
    const result = await this.juegoRepo.update(id, data);
    if (result.affected === 0) {
      throw new Error(`Juego con id ${id} no encontrado`);
    }
    return this.findOne(id) as Promise<Juego>;
  }

  async remove(id: number): Promise<void> {
    const result = await this.juegoRepo.delete(id);
    if (result.affected === 0) {
      throw new Error(`Juego con id ${id} no encontrado`);
    }
  }
}
