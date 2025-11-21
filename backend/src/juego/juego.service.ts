import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Juego } from '../entities/juego.entity';

@Injectable()
export class JuegoService {
  constructor(
    @InjectRepository(Juego)
    private readonly juegoRepo: Repository<Juego>,
  ) {}

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
