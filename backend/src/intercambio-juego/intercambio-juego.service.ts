import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IntercambioJuego } from '../entities/intercambioJuego.entity';

@Injectable()
export class IntercambioJuegoService {
  constructor(
    @InjectRepository(IntercambioJuego)
    private readonly intercambioJuegoRepo: Repository<IntercambioJuego>,
  ) {}

  create(data: Partial<IntercambioJuego>): Promise<IntercambioJuego> {
    const intercambioJuego = this.intercambioJuegoRepo.create(data);
    return this.intercambioJuegoRepo.save(intercambioJuego);
  }

  findAll(): Promise<IntercambioJuego[]> {
    return this.intercambioJuegoRepo.find({
      relations: ['intercambio', 'juego'],
    });
  }

  findOne(id: number): Promise<IntercambioJuego | null> {
    return this.intercambioJuegoRepo.findOne({
      where: { id },
      relations: ['intercambio', 'juego'],
    });
  }

  async update(
    id: number,
    data: Partial<IntercambioJuego>,
  ): Promise<IntercambioJuego> {
    const result = await this.intercambioJuegoRepo.update(id, data);
    if (result.affected === 0) {
      throw new Error(`IntercambioJuego con id ${id} no encontrado`);
    }
    return this.findOne(id) as Promise<IntercambioJuego>;
  }

  async remove(id: number): Promise<void> {
    const result = await this.intercambioJuegoRepo.delete(id);
    if (result.affected === 0) {
      throw new Error(`IntercambioJuego con id ${id} no encontrado`);
    }
  }
}
