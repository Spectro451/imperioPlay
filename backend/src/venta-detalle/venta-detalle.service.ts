import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VentaDetalle } from '../entities/ventaDetalle';

@Injectable()
export class VentaDetalleService {
  constructor(
    @InjectRepository(VentaDetalle)
    private readonly ventaDetalleRepo: Repository<VentaDetalle>,
  ) {}

  create(data: Partial<VentaDetalle>): Promise<VentaDetalle> {
    const detalle = this.ventaDetalleRepo.create(data);
    return this.ventaDetalleRepo.save(detalle);
  }

  findAll(): Promise<VentaDetalle[]> {
    return this.ventaDetalleRepo.find({
      relations: ['venta'],
    });
  }

  findOne(id: number): Promise<VentaDetalle | null> {
    return this.ventaDetalleRepo.findOne({
      where: { id },
      relations: ['venta'],
    });
  }

  async update(id: number, data: Partial<VentaDetalle>): Promise<VentaDetalle> {
    const result = await this.ventaDetalleRepo.update(id, data);
    if (result.affected === 0) {
      throw new NotFoundException(`VentaDetalle con id ${id} no encontrado`);
    }
    return this.findOne(id) as Promise<VentaDetalle>;
  }

  async remove(id: number): Promise<void> {
    const result = await this.ventaDetalleRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`VentaDetalle con id ${id} no encontrado`);
    }
  }
}
