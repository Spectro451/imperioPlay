import { Injectable } from '@nestjs/common';
import { Prisma, VentaJuego } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VentaJuegoService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.VentaJuegoCreateInput): Promise<VentaJuego> {
    return this.prisma.ventaJuego.create({ data });
  }

  async findAll(): Promise<VentaJuego[]> {
    return this.prisma.ventaJuego.findMany();
  }

  async findOne(id: number): Promise<VentaJuego | null> {
    return this.prisma.ventaJuego.findUnique({
      where: { id },
    });
  }

  async update(
    id: number,
    data: Prisma.VentaJuegoUpdateInput,
  ): Promise<VentaJuego> {
    return this.prisma.ventaJuego.update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<VentaJuego> {
    return this.prisma.ventaJuego.delete({
      where: { id },
    });
  }
}
