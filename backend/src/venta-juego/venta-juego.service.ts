import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VentaJuego } from '../entities/ventaJuego.entity';

@Injectable()
export class VentaJuegoService {
  constructor(
    @InjectRepository(VentaJuego)
    private readonly ventaJuegoRepo: Repository<VentaJuego>,
  ) {}

  create(data: Partial<VentaJuego>): Promise<VentaJuego> {
    const ventaJuego = this.ventaJuegoRepo.create(data);
    return this.ventaJuegoRepo.save(ventaJuego);
  }

  findAll(): Promise<VentaJuego[]> {
    return this.ventaJuegoRepo.find({
      relations: ['juego', 'venta'],
    });
  }

  findOne(id: number): Promise<VentaJuego | null> {
    return this.ventaJuegoRepo.findOne({
      where: { id },
      relations: ['juego', 'venta'],
    });
  }

  async update(id: number, data: Partial<VentaJuego>): Promise<VentaJuego> {
    const result = await this.ventaJuegoRepo.update(id, data);
    if (result.affected === 0) {
      throw new NotFoundException(`VentaJuego con id ${id} no encontrado`);
    }
    return this.findOne(id) as Promise<VentaJuego>;
  }

  async remove(id: number): Promise<void> {
    const result = await this.ventaJuegoRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`VentaJuego con id ${id} no encontrado`);
    }
  }
}
