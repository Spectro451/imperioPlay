import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VentaDetalle } from '../entities/ventaDetalle';

@Injectable()
export class VentaDetalleService {
  constructor(
    @InjectRepository(VentaDetalle)
    private readonly ventaProductoRepo: Repository<VentaDetalle>,
  ) {}

  create(data: Partial<VentaDetalle>): Promise<VentaDetalle> {
    const ventaProducto = this.ventaProductoRepo.create(data);
    return this.ventaProductoRepo.save(ventaProducto);
  }

  findAll(): Promise<VentaDetalle[]> {
    return this.ventaProductoRepo.find({
      relations: ['venta'],
    });
  }

  findOne(id: number): Promise<VentaDetalle | null> {
    return this.ventaProductoRepo.findOne({
      where: { id },
      relations: ['venta'],
    });
  }

  async update(id: number, data: Partial<VentaDetalle>): Promise<VentaDetalle> {
    const result = await this.ventaProductoRepo.update(id, data);
    if (result.affected === 0) {
      throw new NotFoundException(`VentaJuego con id ${id} no encontrado`);
    }
    return this.findOne(id) as Promise<VentaDetalle>;
  }

  async remove(id: number): Promise<void> {
    const result = await this.ventaProductoRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`VentaJuego con id ${id} no encontrado`);
    }
  }
}
