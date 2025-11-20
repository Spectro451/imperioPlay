import { Injectable } from '@nestjs/common';
import { Prisma, Juego } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JuegoService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.JuegoCreateInput): Promise<Juego> {
    return this.prisma.juego.create({ data });
  }

  async findAll(): Promise<Juego[]> {
    return this.prisma.juego.findMany();
  }

  async findOne(id: number): Promise<Juego | null> {
    return this.prisma.juego.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: Prisma.JuegoUpdateInput): Promise<Juego> {
    return this.prisma.juego.update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<Juego> {
    return this.prisma.juego.delete({
      where: { id },
    });
  }
}
