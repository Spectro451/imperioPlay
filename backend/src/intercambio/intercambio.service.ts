import { Injectable } from '@nestjs/common';
import { Prisma, Intercambio } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class IntercambioService {
  constructor(private prisma: PrismaService){}

  async create(data: Prisma.IntercambioCreateInput): Promise<Intercambio>{
    return this.prisma.intercambio.create({data});
  }

  async findall():Promise<Intercambio[]> {
    return this.prisma.intercambio.findMany();
  }

  async findOne(id:number) :Promise<Intercambio | null>{
    return this.prisma.intercambio.findUnique({
      where:{id},
    });
  }

  async update(id:number, data:Prisma.IntercambioUpdateInput): Promise<Intercambio>{
    return this.prisma.intercambio.update({
      where: {id},
      data,
    });
  }

  async remove(id:number):Promise<Intercambio>{
    return this.prisma.intercambio.delete({
      where:{id},
    });
  }
}
