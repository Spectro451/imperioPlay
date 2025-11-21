import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Intercambio } from '../entities/intercambio.entity';

@Injectable()
export class IntercambioService {
  constructor(
    @InjectRepository(Intercambio)
    private readonly intercambioRepo: Repository<Intercambio>,
  ) {}

  create(data: Partial<Intercambio>): Promise<Intercambio> {
    const intercambio = this.intercambioRepo.create(data);
    return this.intercambioRepo.save(intercambio);
  }

  findAll(): Promise<Intercambio[]> {
    return this.intercambioRepo.find({
      relations: ['cliente', 'vendedor', 'intercambioJuegos'],
    });
  }

  findOne(id: number): Promise<Intercambio | null> {
    return this.intercambioRepo.findOne({
      where: { id },
      relations: ['cliente', 'vendedor', 'intercambioJuegos'],
    });
  }

  async update(id: number, data: Partial<Intercambio>): Promise<Intercambio> {
    await this.intercambioRepo.update(id, data);
    const updated = await this.findOne(id);
    if (!updated) {
      throw new Error(`Intercambio con id ${id} no encontrado`);
    }
    return updated;
  }

  async remove(id: number): Promise<void> {
    await this.intercambioRepo.delete(id);
  }
}
