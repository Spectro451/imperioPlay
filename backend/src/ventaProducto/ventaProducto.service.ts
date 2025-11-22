import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VentaProducto } from '../entities/ventaProducto';

@Injectable()
export class VentaProductoService {
  constructor(
    @InjectRepository(VentaProducto)
    private readonly ventaProductoRepo: Repository<VentaProducto>,
  ) {}

  create(data: Partial<VentaProducto>): Promise<VentaProducto> {
    const ventaProducto = this.ventaProductoRepo.create(data);
    return this.ventaProductoRepo.save(ventaProducto);
  }

  findAll(): Promise<VentaProducto[]> {
    return this.ventaProductoRepo.find({
      relations: ['juego', 'venta'],
    });
  }

  findOne(id: number): Promise<VentaProducto | null> {
    return this.ventaProductoRepo.findOne({
      where: { id },
      relations: ['juego', 'venta'],
    });
  }

  async update(
    id: number,
    data: Partial<VentaProducto>,
  ): Promise<VentaProducto> {
    const result = await this.ventaProductoRepo.update(id, data);
    if (result.affected === 0) {
      throw new NotFoundException(`VentaJuego con id ${id} no encontrado`);
    }
    return this.findOne(id) as Promise<VentaProducto>;
  }

  async remove(id: number): Promise<void> {
    const result = await this.ventaProductoRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`VentaJuego con id ${id} no encontrado`);
    }
  }
}
