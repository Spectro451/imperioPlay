import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta } from '../entities/venta.entity';

@Injectable()
export class VentaService {
  constructor(
    @InjectRepository(Venta)
    private readonly ventaRepo: Repository<Venta>,
  ) {}

  create(data: Partial<Venta>): Promise<Venta> {
    const venta = this.ventaRepo.create(data);
    return this.ventaRepo.save(venta);
  }

  findAll(): Promise<Venta[]> {
    return this.ventaRepo.find({
      relations: ['cliente', 'vendedor', 'ventaJuegos'],
    });
  }

  findOne(id: number): Promise<Venta | null> {
    return this.ventaRepo.findOne({
      where: { id },
      relations: ['cliente', 'vendedor', 'ventaJuegos'],
    });
  }

  async update(id: number, data: Partial<Venta>): Promise<Venta> {
    const result = await this.ventaRepo.update(id, data);
    if (result.affected === 0) {
      throw new NotFoundException(`Venta con id ${id} no encontrada`);
    }
    return this.findOne(id) as Promise<Venta>;
  }

  async remove(id: number): Promise<void> {
    const result = await this.ventaRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Venta con id ${id} no encontrada`);
    }
  }
}
