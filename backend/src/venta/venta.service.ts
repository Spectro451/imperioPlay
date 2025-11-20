import { Injectable } from '@nestjs/common';
import { Prisma, Venta } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VentaService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.VentaCreateInput): Promise<Venta> {
    return this.prisma.venta.create({ data });
  }

  async findAll(): Promise<Venta[]> {
    return this.prisma.venta.findMany();
  }

  async findOne(id: number): Promise<Venta | null> {
    return this.prisma.venta.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: Prisma.VentaUpdateInput): Promise<Venta> {
    return this.prisma.venta.update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<Venta> {
    return this.prisma.venta.delete({
      where: { id },
    });
  }
}
