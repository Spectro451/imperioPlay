import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from '../entities/producto.entity';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepo: Repository<Producto>,
  ) {}

  create(data: Partial<Producto>): Promise<Producto> {
    const producto = this.productoRepo.create(data);
    return this.productoRepo.save(producto);
  }

  findAll(): Promise<Producto[]> {
    return this.productoRepo.find({ relations: ['juegos'] });
  }

  findOne(id: number): Promise<Producto | null> {
    return this.productoRepo.findOne({
      where: { id },
      relations: ['juegos'],
    });
  }

  async update(id: number, data: Partial<Producto>): Promise<Producto> {
    const result = await this.productoRepo.update(id, data);
    if (result.affected === 0) {
      throw new Error(`Producto con id ${id} no encontrado`);
    }
    return this.findOne(id) as Promise<Producto>;
  }

  async remove(id: number): Promise<void> {
    const result = await this.productoRepo.delete(id);
    if (result.affected === 0) {
      throw new Error(`Producto con id ${id} no encontrado`);
    }
  }
}
